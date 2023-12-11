'use client';

import Loader from '@/components/loader';
import Placeholder from '@/components/placeholder';
import { ProfileList } from '@/components/profile';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';

export default function ProfileListView() {
  const query = useSearchParams();
  const { data: profiles, isLoading, error } = useSWR('/api/profiles?' + query);

  if (isLoading) return <Loader />;
  if (error) return <Placeholder title="Упс" description="Не удалось загрузить список профилей, может еще раз?" />;

  return <ProfileList profiles={profiles} />
}
