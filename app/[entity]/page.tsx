'use client';

import { CardList } from '@/components/card';
import Loader from '@/components/loader';
import Placeholder from '@/components/placeholder';
import { XCircle } from 'lucide-react';
import useSWR from 'swr';

interface EntityListParams {
  entity: string;
}

export default function EntityListView({ params }: { params: EntityListParams }) {
  const {
    data: entities,
    error: entitiesError,
    isLoading: entitiesIsLoading,
  } = useSWR(`/api/${params.entity}/`);

  if (entitiesError) {
    return <Placeholder icon={<XCircle />} title="Произошла ошибка" description="Получить данные не удалось(" />;
  }

  if (entitiesIsLoading) {
    return <Loader />;
  }

  return <CardList type={params.entity} entities={entities} />;
}
