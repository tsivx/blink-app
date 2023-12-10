'use client';

import { Card } from '@/components/card';
import { PinnedEntities } from '@/components/card-actions';
import { useUser } from '@/hooks/useUser';
import Link from 'next/link';

export default function Home() {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col gap-2">
        <PinnedEntities type='teachers' />

        {user && (
          <Link href={'/update'}>
            <Card type={'Диспетчерам'} title="Обновить расписание" />
          </Link>
        )}

        <Link href={'/groups'}>
          <Card type={'Расписание'} title="Группы" />
        </Link>
        <Link href={'/teachers'}>
          <Card type={'Расписание'} title="Преподаватели" />
        </Link>
        <Link href={'/auditories'}>
          <Card type={'Расписание'} title="Аудитории" />
        </Link>

        <div className="grid grid-cols-2 gap-2">
          <Link href={'https://pay.cloudtips.ru/p/6d76a463'}>
            <Card type={'Обратная связь'} title="Поддержать проект" />
          </Link>

          <Link href={'/telegram'}>
            <Card type={'Обратная связь'} title="Канал в Telegram" />
          </Link>
        </div>
      </div>
    </div>
  );
}
