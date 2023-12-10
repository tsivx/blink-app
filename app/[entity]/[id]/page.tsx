'use client';

import { AuditoryCard, GroupCard, TeacherCard } from '@/components/card';
import { CopyLinkButton, PinButton } from '@/components/card-actions';
import { Weekdays } from '@/components/lesson';
import Loader from '@/components/loader';
import Placeholder from '@/components/placeholder';
import { GroupRow, TeacherRow } from '@/types';
import { entityKeys } from '@/utils/blink';
import { XCircle } from 'lucide-react';
import useSWR from 'swr';

interface GetEntityByIdParams {
  entity: string;
  id: string;
}

export default function EntityView({ params }: { params: GetEntityByIdParams }) {
  const {
    data: entity,
    error: entityError,
    isLoading: entityIsLoading,
  } = useSWR(`/api/${params.entity}/${params.id}`);
  
  const {
    data: weekdays,
    error: weekdaysError,
    isLoading: weekdaysIsLoading,
  } = useSWR(`/api/lessons?${entityKeys[params.entity]}=${params.id}`);

  if (entityError && weekdaysError) {
    return <Placeholder icon={<XCircle />} title="Произошла ошибка" description="Получить данные не удалось(" />;
  }

  if (entityIsLoading || weekdaysIsLoading) {
    return <Loader />;
  }

  return (
    <>
      {params.entity === 'groups' && (
        <GroupCard group={entity as GroupRow}>
          <div className="actions flex gap-2 w-full">
            <PinButton type={params.entity} id={entity.id} />
            <CopyLinkButton type={params.entity} id={entity.id} />
          </div>
          <Weekdays weekdays={weekdays} />
        </GroupCard>
      )}
      {params.entity === 'teachers' && (
        <TeacherCard teacher={entity as TeacherRow}>
          <div className="actions flex gap-2 w-full">
            <PinButton type={params.entity} id={entity.id} />
            <CopyLinkButton type={params.entity} id={entity.id} />
          </div>
          <Weekdays weekdays={weekdays} />
        </TeacherCard>
      )}
      {params.entity === 'auditories' && (
        <AuditoryCard auditory={entity as GroupRow}>
          <div className="actions flex gap-2 w-full">
            <PinButton type={params.entity} id={entity.id} />
            <CopyLinkButton type={params.entity} id={entity.id} />
          </div>
          
          <Weekdays weekdays={weekdays} />
        </AuditoryCard>
      )}
    </>
  );
}
