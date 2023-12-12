import { ExtendedLessonRow, Weekday } from '@/types';
import dayjs from '@/utils/dayjs';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface GetProfileByIdProps {
  id: number;
}

export async function GET(req: NextRequest, ctx: { params: GetProfileByIdProps }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: profile, error } = await supabase.from('profiles').select('id, type').eq('id', ctx.params.id).single();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('*, group:group_id (id, name), teacher:teacher_id (id, name), auditory:auditory_id (id, name)')
    .eq(`${profile.type}_id`, profile.id)
    .returns<ExtendedLessonRow[]>();

  if (lessonsError) {
    return NextResponse.json(error, { status: 500 });
  }

  const { data: lessonsTimetable } = await supabase.from('lessons_timetable').select('*').order('id', { ascending: false }).limit(1).single()

  lessons.sort((a, b) => {
    const dateA = dayjs(a.date!, 'YYYY-MM-DD');
    const dateB = dayjs(b.date!, 'YYYY-MM-DD');

    if (dateA.isSame(dateB)) {
      return a.number! - b.number!;
    }

    return dateA.isBefore(dateB) ? -1 : 1;
  });

  const lessonsByDate: { [key: string]: ExtendedLessonRow[] } = {};
  lessons.forEach((lesson) => {
    if (lessonsTimetable) {      
      const timetable = lessonsTimetable.timetable as { [key: string]: { [key: string]: { time_start: string, time_end: string } } }

      const weekday = dayjs(lesson.date, 'YYYY-MM-DD').isoWeekday();
      const lessonTime = timetable[`${weekday}`][`${lesson.number}`];

      lesson.time_start = lessonTime.time_start;
      lesson.time_end = lessonTime.time_end;
    }

    if (!lessonsByDate[lesson.date!]) {
      lessonsByDate[lesson.date!] = [];
    }
    lessonsByDate[lesson.date!].push(lesson);
  });

  const weekdays: Weekday[] = [];

  for (const date in lessonsByDate) {
    const groupedLessons: ExtendedLessonRow[] = [];
    lessonsByDate[date].forEach((lesson) => {
      if (lesson.subgroup === 0) {
        groupedLessons.push(lesson);
      } else {
        const existingLesson = groupedLessons.find((l) => l.number === lesson.number);

        if (existingLesson) {
          if (!existingLesson.subgroups) {
            existingLesson.subgroups = [];
          }

          existingLesson.subgroups.push({
            number: lesson.subgroup!,
            teacher: lesson.teacher,
            auditory: lesson.auditory,
            group: lesson.group,
          });
        } else {
          groupedLessons.push({
            ...lesson,
            subgroups: [
              {
                number: lesson.subgroup!,
                teacher: lesson.teacher,
                auditory: lesson.auditory,
                group: lesson.group,
              },
            ],
          });
        }
      }
    });

    weekdays.push({ date, lessons: groupedLessons });
  }

  return NextResponse.json(weekdays);
}
