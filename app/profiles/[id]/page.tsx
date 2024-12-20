'use client';

import { Card } from '@/components/card';
import { Weekdays } from '@/components/lesson';
import Loader from '@/components/loader';
import Placeholder from '@/components/placeholder';
import { CopyProfileLink, PinProfileButton } from '@/components/profile';
import Link from 'next/link';
import useSWR from 'swr';

interface GetProfileByIdProps {
  id: number;
}

export default function ProfileView({ params }: { params: GetProfileByIdProps }) {
  const { data: profile, isLoading, error } = useSWR('/api/profiles/' + params.id);

  if (isLoading) return <Loader />;
  if (error) return <Placeholder title="Упс" description="Не удалось загрузить профиль, может еще раз?" />;

  return (
    <Card
      key={profile.id}
      title={profile.name}
      description={profile.description!}
      caption={profile.type}
      actions={[
        <PinProfileButton profile={profile} />,
        <CopyProfileLink profile={profile} />
      ]}
    >
      <Link href={'https://t.me/blink_schedule_app'}>
        <Card caption={'ВАЖНО!'} title="Подпишитесь на канал в Telegram" description="там безумно важная инфа" />
      </Link>

      <Weekdays profileId={profile.id} />
    </Card>
  );
}
