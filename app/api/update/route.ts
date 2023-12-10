import { AvtorTimetable } from '@/types';
import { Database } from '@/types/supabase';
import { dateToISO } from '@/utils/blink';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

type GroupInsertRow = Database['public']['Tables']['groups']['Insert'];
type TeacherInsertRow = Database['public']['Tables']['teachers']['Insert'];
type AuditoryInsertRow = Database['public']['Tables']['auditories']['Insert'];
type LessonInsertRow = Database['public']['Tables']['lessons']['Insert'];

interface UpdateCache {
  groups: { [key: string]: GroupInsertRow };
  teachers: { [key: string]: TeacherInsertRow };
  auditories: { [key: string]: AuditoryInsertRow };
  lessons: LessonInsertRow[];
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Необходимо зайти в аккаунт диспетчера' }, { status: 401 });
  }

  const { data: college, error: getCollegeError } = await supabase
    .from('colleges')
    .select('id')
    .eq('supervisor_id', session.user.id)
    .single();

  if (getCollegeError) {
    return NextResponse.json({ error: 'Не удалось получить данные о колледже' }, { status: 500 });
  }

  const collegeId = college.id;
  const requestBody = await req.json();
  const timetables = requestBody as AvtorTimetable[];

  const cache: UpdateCache = {
    groups: {},
    teachers: {},
    auditories: {},
    lessons: [],
  };

  const { data: teachers } = await supabase.from('teachers').select();
  const { data: auditories } = await supabase.from('auditories').select(); // college;
  const { data: groups } = await supabase.from('groups').select();

  for (const teacher of teachers!) cache.teachers[teacher.name!] = teacher;
  for (const auditory of auditories!) cache.auditories[auditory.name!] = auditory;
  for (const group of groups!) cache.groups[group.name!] = group;

  for (const { timetable } of timetables) {
    for (const week of timetable) {
      for (const group of week.groups) {
        const cachedGroup = cache.groups[group.group_name];

        if (!cachedGroup || !cachedGroup.id) {
          cache.groups[group.group_name] = {
            name: group.group_name,
            course: group.course,
            college_id: +collegeId,
          };
        }

        for (const day of group.days) {
          if (!day.lessons) continue;

          for (const lesson of day.lessons) {
            for (const teacher of lesson.teachers) {
              const cachedTeacher = cache.teachers[teacher.teacher_name];

              if (!cachedTeacher || !cachedTeacher.id) {
                cache.teachers[teacher.teacher_name] = {
                  name: teacher.teacher_name,
                  college_id: +collegeId,
                };
              }
            }

            for (const auditory of lesson.auditories) {
              const cachedAuditory = cache.auditories[auditory.auditory_name];

              if (!cachedAuditory || !cachedAuditory.id) {
                cache.auditories[auditory.auditory_name] = {
                  name: auditory.auditory_name,
                  college_id: +collegeId,
                };
              }
            }
          }
        }
      }
    }
  }

  const notExistGroups = Object.values(cache.groups).filter((i) => !i.id);
  const notExistTeachers = Object.values(cache.teachers).filter((i) => !i.id);
  const notExistAuditories = Object.values(cache.auditories).filter((i) => !i.id);

  if (notExistGroups.length) {
    const { data: insertedGroups } = await supabase.from('groups').insert(notExistGroups).select().throwOnError();
    for (const group of insertedGroups!) cache.groups[group.name!] = group;
  }

  if (notExistTeachers.length) {
    const { data: insertedTeachers } = await supabase.from('teachers').insert(notExistTeachers).select().throwOnError();
    for (const teacher of insertedTeachers!) {
      cache.teachers[teacher.name!] = teacher;
    }
  }

  if (notExistAuditories.length) {
    const { data: insertedAuditories } = await supabase
      .from('auditories')
      .insert(notExistAuditories)
      .select()
      .throwOnError();
    for (const auditory of insertedAuditories!) {
      cache.auditories[auditory.name!] = auditory;
    }
  }

  for (const { timetable } of timetables) {
    for (const week of timetable) {
      // remove associated lessons which is not actual with current week replacing
      const { error: removeError } = await supabase.from('lessons').delete().eq('week_id', week.week_number);

      if (removeError) {
        console.log('Current week not exist');
      }

      const { data: newWeek, error } = await supabase
        .from('weeks')
        .upsert({
          date_start: dateToISO(week.date_start),
          date_end: dateToISO(week.date_end),
          id: week.week_number,
        })
        .select('id')
        .single();

      if (error) {
        console.error(error);
        break;
      }

      for (const group of week.groups) {
        const cachedGroup = cache.groups[group.group_name];

        if (!cachedGroup) {
          console.log('no group');
          continue;
        }

        for (const day of group.days) {
          if (!day.lessons) continue;

          for (const lesson of day.lessons) {
            const cachedTeacher = lesson.teachers[0] ? cache.teachers[lesson.teachers[0].teacher_name] : null;
            const cachedAuditory = lesson.auditories[0] ? cache.auditories[lesson.auditories[0].auditory_name] : null;

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
              week_id: newWeek.id,
              college_id: +collegeId,
            });
          }
        }
      }
    }
  }

  const { data: insertedLessons, error } = await supabase.from('lessons').insert(cache.lessons).select();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json(insertedLessons);
}
