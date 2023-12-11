import { ProfileRow } from '@/types';
import { SITE_URL, api } from '@/utils/blink';
import { HelpCircle, Link2, Pin, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { Card } from './card';
import Loader from './loader';
import Placeholder from './placeholder';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';

export function ProfileList({ profiles }: { profiles: ProfileRow[] }) {
  const [filteredProfiles, setFilteredProfiles] = useState<ProfileRow[]>(profiles || []);

  const onSearch = (keyword: string) => {
    const filtered = profiles.filter((profile: ProfileRow) =>
      profile.name!.toLowerCase().includes(keyword.toLowerCase()),
    );
    setFilteredProfiles(filtered);
  };

  return (
    <div className="profiles flex flex-col gap-2">
      <div className="searchbar flex items-center gap-2">
        <Search />
        <Input
          onChange={(e) => {
            onSearch(e.target.value);
          }}
          type="text"
          className="bg-muted"
          placeholder="Поиск..."
        />
      </div>

      <div className="profiles-list grid gap-2 lg:grid-cols-3">
        {filteredProfiles.length ? (
          filteredProfiles.map((profile: ProfileRow) => (
            <Link key={profile.id} href={'/profiles/' + profile.id}>
              <Card
                key={profile.id}
                title={profile.name}
                description={profile.description!}
                caption={profile.type}
              ></Card>
            </Link>
          ))
        ) : (
          <Placeholder title="Упс" description="Кажется тут ничего нет" icon={<HelpCircle />} />
        )}
      </div>
    </div>
  );
}

export function CopyProfileLink({ profile }: { profile: ProfileRow }) {
  const { toast } = useToast();

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(`${SITE_URL}/profiles/${profile.id}`);
      toast({
        title: 'Ссылка на профиль скопирована',
      });
    } catch (error) {
      toast({
        title: 'Не удалось скопировать ссылку',
      });
    }
  };

  return (
    <Button onClick={onClick} variant={'outline'} size={'icon'}>
      <Link2 className="h-5 w-5" />
    </Button>
  );
}

export function PinProfileButton({ profile }: { profile: ProfileRow }) {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();

  const onClick = async () => {
    try {
      await api({
        url: '/api/profiles/pinned',
        method: profile.pinned ? 'DELETE' : 'POST',
        data: {
          id: profile.id,
        },
      });

      toast({
        title: profile.pinned ? `Профиль ${profile.name} откреплен` : `Добавлено в закрепы`,
        description: profile.pinned ? undefined : `Профиль ${profile.name} можно найти на главном экране`,
      });
    } catch {
      toast({
        title: `Закрепить не удалось`,
        description: `Повторите попытку снова`,
      });
    }

    mutate('/api/profiles/' + profile.id);
  };

  return (
    <Button onClick={onClick} size={'icon'} variant={profile.pinned ? 'outline' : 'default'}>
      <Pin className="h-5 w-5" />
    </Button>
  );
}

export function PinnedProfileList() {
  const { data: profiles, isLoading, error } = useSWR('/api/profiles/pinned');

  if (isLoading) return <Loader />;
  if (error) return <Placeholder title="Упс" description="Не удалось загрузить профиль, может еще раз?" />;
  if (!profiles.length) return <></>;

  return (
    <div className="pinned-profiles flex flex-col gap-2 p-2 border rounded-md">
      <div className="caption flex text-muted-foreground items-center gap-1">
        <Pin className="h-5 w-5" />
        Закрепы
      </div>
      {profiles.map((profile: ProfileRow) => (
        <Link key={profile.id} href={'/profiles/' + profile.id}>
          <Card key={profile.id} title={profile.name} description={profile.description!} caption={profile.type}></Card>
        </Link>
      ))}
    </div>
  );
}
