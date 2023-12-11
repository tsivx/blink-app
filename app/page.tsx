'use client';

import { Card } from '@/components/card';
import { PinnedProfileList } from '@/components/profile';
import { useUser } from '@/hooks/useUser';
import Link from 'next/link';

export default function Home() {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col gap-2">
        <PinnedProfileList />

        <Link href={'/profiles?type=group'}>
          <Card caption={'Расписание'} title="Группы" />
        </Link>
        <Link href={'/profiles?type=teacher'}>
          <Card caption={'Расписание'} title="Преподаватели" />
        </Link>
        <Link href={'/profiles?type=auditory'}>
          <Card caption={'Расписание'} title="Аудитории" />
        </Link>

        <div className="grid grid-cols-2 gap-2">
          <Link href={'https://pay.cloudtips.ru/p/6d76a463'}>
            <Card caption={'Обратная связь'} title="Поддержать проект" />
          </Link>

          <Link href={'https://t.me/blink_schedule_app'}>
            <Card caption={'Обратная связь'} title="Канал в Telegram" />
          </Link>
        </div>
      </div>
    </div>
  );
}
