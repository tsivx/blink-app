'use client';

import {
  AuditoryRow,
  Entity,
  ExtendedAuditoryRow,
  ExtendedGroupRow,
  ExtendedTeacherRow,
  GroupRow,
  TeacherRow,
} from '@/types';
import { HelpCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Placeholder from './placeholder';
import { Input } from './ui/input';

interface CardProps {
  children?: React.ReactNode;
  type: string;
  title: string;
  description?: string;
  actions?: React.JSX.Element[];
}

export function Card({ children, type, title, description, actions }: CardProps) {
  return (
    <div className="card flex flex-col gap-4">
      <div className="card-header flex items-center justify-between bg-primary-foreground p-4 rounded-md hover:bg-muted transition-colors">
        <div className="card-info flex flex-col">
          <div className="card-type text-muted-foreground text-xs uppercase">{type}</div>
          <div className="card-title text-xl font-bold">{title}</div>
          {description && <div className="card-description text-muted-foreground">{description}</div>}
        </div>

        {actions && <div className="card-actions flex gap-2">{actions.map((action) => action)}</div>}
      </div>

      {children && <div className="card-content space-y-4">{children}</div>}
    </div>
  );
}

export function GroupCard({ children, group }: { children?: React.ReactNode; group: ExtendedGroupRow }) {
  return (
    <Card
      title={group.name!}
      description={`${group.course} курс`}
      type={group.college?.name!}
    >
      {children}
    </Card>
  );
}

export function TeacherCard({ children, teacher }: { children?: React.ReactNode; teacher: ExtendedTeacherRow }) {
  return (
    <Card title={teacher.name!} type={teacher.college?.name!}>
      {children}
    </Card>
  );
}

export function AuditoryCard({ children, auditory }: { children?: React.ReactNode; auditory: ExtendedAuditoryRow }) {
  return (
    <Card title={auditory.name!} type={auditory.college?.name!}>
      {children}
    </Card>
  );
}

export function CardList({ type, entities }: { type: string; entities: Entity[] }) {
  const [filteredEntities, setFilteredEntities] = useState<Entity[]>(entities);

  const onSearch = (keyword: string) => {
    const filtered = entities.filter((entity) => entity.name!.toLowerCase().includes(keyword.toLowerCase()));
    setFilteredEntities(filtered);
  };

  return (
    <div className="card-list flex flex-col gap-2">
      <div className="searchbar flex flex-col gap-2 bg-primary-foreground p-4 rounded-md">
        <div className="caption text-sm text-muted-foreground">Быстрый поиск</div>
        <div className="searchbar-input flex items-center gap-3">
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
      </div>

      <div className="grid gap-2 lg:grid-cols-3">
        {!filteredEntities.length && (
          <Placeholder icon={<HelpCircle />} title="Кажется, тут ничего нет" description="треск сверчков" />
        )}

        {type === 'groups' &&
          filteredEntities.map((entity: GroupRow) => (
            <Link key={entity.id} href={`/${type}/${entity.id}`}>
              <GroupCard group={entity} />
            </Link>
          ))}
        {type === 'teachers' &&
          filteredEntities.map((entity: TeacherRow) => (
            <Link key={entity.id} href={`/${type}/${entity.id}`}>
              <TeacherCard teacher={entity} />
            </Link>
          ))}
        {type === 'auditories' &&
          filteredEntities.map((entity: AuditoryRow) => (
            <Link key={entity.id} href={`/${type}/${entity.id}`}>
              <AuditoryCard auditory={entity} />
            </Link>
          ))}
      </div>
    </div>
  );
}
