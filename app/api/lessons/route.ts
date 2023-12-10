import { ExtendedLessonRow, Weekday } from "@/types";
import dayjs from "@/utils/dayjs";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const searchParams = req.nextUrl.searchParams;
  const groupId = searchParams.get("group_id");
  const teacherId = searchParams.get("teacher_id");
  const auditoryId = searchParams.get("auditory_id");
  const weekId = searchParams.get("week_id");

  let query = supabase
    .from("lessons")
    .select(
      "*, group:groups (id, name), teacher:teachers (id, name), auditory:auditories (id, name)"
    );

  if (groupId) {
    query = query.eq("group_id", groupId);
  }
  if (teacherId) {
    query = query.eq("teacher_id", teacherId);
  }
  if (auditoryId) {
    query = query.eq("auditory_id", auditoryId);
  }
  if (weekId) {
    query = query.eq("week_id", weekId);
  }

  const { data: lessons, error } = await query.returns<ExtendedLessonRow[]>();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  lessons.sort((a, b) => {
    const dateA = dayjs(a.date!, "YYYY-MM-DD");
    const dateB = dayjs(b.date!, "YYYY-MM-DD");

    if (dateA.isSame(dateB)) {
      return a.number! - b.number!;
    }

    return dateA.isBefore(dateB) ? -1 : 1;
  });

  const lessonsByDate: { [key: string]: ExtendedLessonRow[] } = {};
  lessons.forEach((lesson) => {
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

    const currentDate = dayjs();

    // Сортируем массив
    weekdays.sort((a, b) => {
      const dateA = dayjs(a.date);
      const dateB = dayjs(b.date);
    
      // Разница в днях между датами
      const diffA = Math.abs(currentDate.diff(dateA, 'day'));
      const diffB = Math.abs(currentDate.diff(dateB, 'day'));
    
      // Текущий день сверху, остальные идут от дальнего к ближайшему
      if (diffA === 0) return -1;
      if (diffB === 0) return 1;
    
      return diffB - diffA;
    });
  }

  return NextResponse.json(weekdays);
}