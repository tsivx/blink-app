import { AvtorTimetable } from '@/types';
import { Database } from '@/types/supabase';
import { dateToISO } from '@/utils/blink';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

type ProfileInsertRow = Database['public']['Tables']['profiles']['Insert'];
type LessonInsertRow = Database['public']['Tables']['lessons']['Insert'];

interface UpdateCache {
  profiles: { [key: string]: ProfileInsertRow };
  lessons: LessonInsertRow[];
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('auth_id', session.user.id).single();

  if (profileError) {
    return NextResponse.json({ error: 'Не удалось получить данные о профиле', details: profileError.message });
  }

  const query = req.nextUrl.searchParams;
  const customCollegeId = query.get('tsivxrev_custom_college_id');

  const collegeId = customCollegeId ? customCollegeId : profile.college_id;
  const requestBody = await req.json();
  const timetables = requestBody as AvtorTimetable[];
    
  const cache: UpdateCache = {
    profiles: {},
    lessons: [],
  };

  const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*').in('type', ['group', 'teacher', 'auditory']);

  if (profilesError) {
    return NextResponse.json({ error: 'Не удалось получить профили', details: profilesError });
  }

  for (const profile of profiles) {
    cache.profiles[`${profile.type}:${profile.name}`] = profile;
  }

  for (const { timetable } of timetables) {
    for (const week of timetable) {
      for (const group of week.groups) {
        const cachedGroup = cache.profiles[`group:${group.group_name}`]

        if (!cachedGroup || !cachedGroup.id) {
          cache.profiles[`group:${group.group_name}`] = {
            name: group.group_name,
            type: 'group',
            metadata: { course: group.course },
            college_id: +collegeId,
          };
        }

        for (const day of group.days) {
          if (!day.lessons) continue;

          for (const lesson of day.lessons) {
            for (const teacher of lesson.teachers) {
              const cachedTeacher = cache.profiles[`teacher:${teacher.teacher_name}`]

              if (!cachedTeacher || !cachedTeacher.id) {
                cache.profiles[`teacher:${teacher.teacher_name}`] = {
                  name: teacher.teacher_name,
                  type: 'teacher',
                  metadata: {},
                  college_id: +collegeId,
                };
              }
            }

            for (const auditory of lesson.auditories) {
              const cachedAuditory = cache.profiles[`auditory:${auditory.auditory_name}`]

              if (!cachedAuditory || !cachedAuditory.id) {
                cache.profiles[`auditory:${auditory.auditory_name}`] = {
                  name: auditory.auditory_name,
                  type: 'auditory',
                  metadata: {},
                  college_id: +collegeId,
                };
              }
            }
          }
        }
      }
    }
  }

  const notExistProfiles = Object.values(cache.profiles).filter((profile) => !profile.id);

  if (notExistProfiles.length) {
    const { data: insertedProfiles } = await supabase.from('profiles').insert(notExistProfiles).select().throwOnError();
    for (const profile of insertedProfiles!) cache.profiles[`${profile.type}:${profile.name}`] = profile;
  }

  for (const { timetable } of timetables) {
    for (const week of timetable) {
      // remove associated lessons which is not actual with current week replacing
      const { error } = await supabase.from('lessons').delete().eq('college_id', collegeId);

      if (error) {
        console.log(error);
      }

      for (const group of week.groups) {
        const cachedGroup = cache.profiles[`group:${group.group_name}`];

        if (!cachedGroup) {
          console.log('no group');
          continue;
        }

        for (const day of group.days) {
          if (!day.lessons) continue;

          for (const lesson of day.lessons) {
            const cachedTeacher = lesson.teachers[0] ? cache.profiles[`teacher:${lesson.teachers[0].teacher_name}`] : null;
            const cachedAuditory = lesson.auditories[0] ? cache.profiles[`auditory:${lesson.auditories[0].auditory_name}`] : null;

            cache.lessons.push({
              name: lesson.subject,
              number: lesson.time,
              date: dateToISO(lesson.date),
              time_start: lesson.time_start,
              time_end: lesson.time_end,
              subgroup: lesson.subgroup,
              teacher_id: cachedTeacher ? cachedTeacher.id : null,
              auditory_id: cachedAuditory ? cachedAuditory.id : null,
              group_id: cachedGroup ? cachedGroup.id : null,
              week: week.week_number,
              college_id: +collegeId,
            });
          }
        }
      }
    }
  }

  const { error } = await supabase.from('lessons').insert(cache.lessons);

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json(true);
}
