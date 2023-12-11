'use client';

import { ExtendedLessonRow, Weekday as IWeekday } from '@/types';
import dayjs from '@/utils/dayjs';
import { PartyPopper } from 'lucide-react';
import Link from 'next/link';
import useSWR from 'swr';
import Loader from './loader';
import Placeholder from './placeholder';
import { Badge } from './ui/badge';

const weekdayByDate = (date: string): string => dayjs(date, 'YYYY-MM-DD').format('dddd');
const humanDate = (date: string): string => dayjs(date, 'YYYY-MM-DD').format('D MMMM');
const hmsToHm = (time: string): string => dayjs(time, 'HH:mm:ss').format('HH:mm');
const lessonNow = (date: string, time_start: string, time_end: string): boolean =>
  dayjs().isBetween(
    dayjs(`${date} ${time_start}`, 'YYYY-MM-DD HH:mm:ss'),
    dayjs(`${date} ${time_end}`, 'YYYY-MM-DD HH:mm:ss'),
  );

const isToday = (date: string) => dayjs(date, 'YYYY-MM-DD').isToday();

export function Weekdays({ profileId }: { profileId: number }) {
  const { data: weekdays, isLoading, error } = useSWR(`/api/profiles/${profileId}/lessons`);

  if (isLoading) return <Loader />;
  if (error) return <Placeholder title="Упс" description="Не удалось загрузить занятия, может еще раз?" />;

  return (
    <div className="weekdays grid gap-4 lg:grid-cols-3">
      {weekdays.length ? (
        weekdays.map((weekday: IWeekday) => <Weekday key={weekday.date} weekday={weekday} />)
      ) : (
        <Placeholder icon={<PartyPopper />} title="Занятий нет" description="Может, расписание еще не готово" />
      )}
    </div>
  );
}

export function Weekday({ weekday }: { weekday: IWeekday }) {
  return (
    <div key={weekday.date} className="weekday flex flex-col gap-2">
      <div className="weekday-header flex items-center justify-between">
        <div className="weekday-title flex flex-col">
          <div className="weekday text-lg font-bold capitalize">{weekdayByDate(weekday.date)}</div>
        </div>
        <div className="actions flex items-center gap-2">
          <div className="weekday-date text-sm">
            <Badge variant="secondary">{humanDate(weekday.date)}</Badge>
          </div>

          {isToday(weekday.date) && (
            <div className="weekday-today text-sm">
              <Badge variant="default">сегодня</Badge>
            </div>
          )}
        </div>
      </div>

      <Lessons lessons={weekday.lessons} />
    </div>
  );
}

export function Lessons({ lessons }: { lessons: ExtendedLessonRow[] }) {
  return (
    <div className="lessons flex flex-col gap-2">
      {lessons.length ? (
        lessons.map((lesson) => <Lesson key={lesson.number} lesson={lesson} />)
      ) : (
        <Placeholder icon={<PartyPopper />} title="Занятий нет" description="Может, расписание еще не готово" />
      )}
    </div>
  );
}

export function Lesson({ lesson }: { lesson: ExtendedLessonRow }) {
  return (
    <div className="lesson flex items-center p-2 rounded-md gap-2 bg-primary-foreground">
      <div className="lesson-number text-lg font-bold p-2">{lesson.number}</div>

      <div className="lesson-info flex flex-col gap-0.5">
        <div className="lesson-name">{lesson.name}</div>
        <div className="lesson-details flex flex-wrap gap-1 !items-center">
          <div className="lesson-time">
            <Badge
              variant={lessonNow(lesson.date!, lesson.time_start!, lesson.time_end!) ? 'default' : 'secondary'}
            >{`${hmsToHm(lesson.time_start!)} - ${hmsToHm(lesson.time_end!)}`}</Badge>
          </div>

          {!(lesson.subgroups && lesson.subgroups.length > 1) && (
            <>
              {lesson.group && (
                <div className="lesson-group">
                  <Link href={`/profiles/${lesson.group.id}`}>
                    <Badge variant="secondary">{lesson.group.name}</Badge>
                  </Link>
                </div>
              )}

              {lesson.teacher && (
                <div className="lesson-teacher">
                  <Link href={`/profiles/${lesson.teacher.id}`}>
                    <Badge variant="secondary">{lesson.teacher.name}</Badge>
                  </Link>
                </div>
              )}

              {lesson.auditory && (
                <div className="lesson-auditory">
                  <Link href={`/profiles/${lesson.auditory.id}`}>
                    <Badge variant="secondary">{lesson.auditory.name}</Badge>
                  </Link>
                </div>
              )}
            </>
          )}

          {lesson.subgroups && lesson.subgroups.length > 1 && (
            <div className="subgroups flex flex-wrap gap-2 py-2">
              {lesson.subgroups!.map((subgroup) => {
                return (
                  <div key={subgroup.number} className="subgroup flex flex-col gap-1 text-xs p-2 border rounded-md">
                    <div className="title text-muted-foreground">Подгруппа {subgroup.number}</div>

                    <div className="flex gap-1">
                      {subgroup.group && (
                        <Link href={`/profiles/${subgroup.group.id}`}>
                          <Badge variant="secondary">{subgroup.group.name}</Badge>
                        </Link>
                      )}
                      {subgroup.teacher && (
                        <Link href={`/profiles/${subgroup.teacher.id}`}>
                          <Badge variant="secondary">{subgroup.teacher.name}</Badge>
                        </Link>
                      )}
                      {subgroup.auditory && (
                        <Link href={`/profiles/${subgroup.auditory.id}`}>
                          <Badge variant="secondary">{subgroup.auditory.name}</Badge>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
