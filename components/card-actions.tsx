'use client';

import { ExtendedGroupRow, ExtendedTeacherRow } from '@/types';
import { SITE_URL, api } from '@/utils/blink';
import { Check, Link2, Pin } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import useSWR from 'swr';
import { GroupCard, TeacherCard } from './card';
import Loader from './loader';
import Placeholder from './placeholder';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

export function CopyLinkButton({ type, id }: { type: string, id: number }) {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  
  const copyLink = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(`${SITE_URL}/${type}/${id}`);

    setTimeout(() => {
      setIsCopied(false);
    }, 5000);
  };

  return (
    <Button className='w-full' variant={'outline'} onClick={copyLink}>
      {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Link2 className="h-4 w-4 mr-2" />}
      { isCopied ? 'Ссылка скопирована' : 'Скопировать ссылку' }
    </Button>
  )
}

export function PinButton({ type, id }: { type: string, id: number }) {
  const { toast } = useToast();
  const { data: isPinned, isLoading, mutate } = useSWR(`/api/${type}/pinned/${id}`);

  const pinUnpin = async () => {
    try {
      await api({
        url: `/api/${type}/pinned/${id}`,
        method: isPinned ? 'DELETE' : 'POST'
      });

      mutate();
    } catch {
      toast({
        title: 'Не удалось закрепить',
        description: 'Повторите попытку позже'
      });
    }
  };

  return (
    <Button className='w-full' onClick={pinUnpin} disabled={isLoading} variant={isPinned ? 'outline' : 'default'}>
      { isLoading ? <Loader /> : <Pin className="h-4 w-4 mr-2" /> }
      { isPinned ? 'Открепить' : 'Закрепить' }
    </Button>
  );
}

export function PinnedEntities({ type }: { type: string }) {
  const { data: pinnedGroups, isLoading: groupsIsLoading, error: groupsError } = useSWR(`/api/groups/pinned`);
  const { data: pinnedTeachers, isLoading: teachersIsLoading, error: teachersError } = useSWR(`/api/teachers/pinned`);

  const groups = groupsIsLoading || groupsError ? [] : pinnedGroups;
  const teachers = teachersIsLoading || teachersError ? [] : pinnedTeachers;

  if (groupsIsLoading || teachersIsLoading) {
    return <Placeholder icon={<Loader />} title="Ищем ваши закрепы" description="Надеюсь, что-нибудь найдется" />;
  }

  // снизу говно, нужно исправить
  return (
    <>
      {(!!groups.length || !!teachers.length) && (
        <div className="pinned-entities p-2 flex-col border rounded-md flex gap-2">
          <div className="caption text-muted-foreground flex items-center">
            <Pin className="h-5 w-5 mr-1" />
            Закрепы
          </div>

          <div className="pinned-entities-list flex flex-col gap-2">
            {groups.map((group: ExtendedGroupRow) => (
              <Link key={group.id} href={`/groups/${group.id}`}>
                <GroupCard group={group} />
              </Link>
            ))}
            {teachers.map((teacher: ExtendedTeacherRow) => (
              <Link key={teacher.id} href={`/teachers/${teacher.id}`}>
                <TeacherCard teacher={teacher} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
