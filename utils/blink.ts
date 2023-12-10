import dayjs from "@/utils/dayjs";
import axios from "axios";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";


export const allowedEntities = ['teachers', 'groups', 'auditories'];

export const entityKeys: { [key: string]: string } = {
  teachers: 'teacher_id',
  groups: 'group_id',
  auditories: 'auditory_id',
};

export function dateToISO(date: string): string {
  return dayjs(date, 'D-MM-YYYY').format('YYYY-MM-DD');
}

export const getPinnedEntities = (cookies: ReadonlyRequestCookies, entityType: string): number[] => {
  const cookie = cookies.get('pinned_' + entityType);

  if (!cookie) {
    cookies.set(`pinned_` + entityType, JSON.stringify([]));
    return [];
  }

  try {
    const pinnedEntities = JSON.parse(cookie?.value);

    if (pinnedEntities instanceof Array) {
      return pinnedEntities;
    } else {
      cookies.set(`pinned_` + entityType, JSON.stringify([]));
    }

    return pinnedEntities;
  } catch {
    cookies.set(`pinned_` + entityType, JSON.stringify([]));
    return [];
  }
};

export const addPinnedEntity = (cookies: ReadonlyRequestCookies, entityType: string, id: number) => {
  const pinnedEntities = getPinnedEntities(cookies, entityType);

  if (!pinnedEntities.includes(id)) {
    pinnedEntities.push(id);
  }

  cookies.set(`pinned_` + entityType, JSON.stringify(pinnedEntities));

  return pinnedEntities;
};

export const deletePinnedEntity = (cookies: ReadonlyRequestCookies, entityType: string, id: number) => {
  let pinnedEntities = getPinnedEntities(cookies, entityType);

  pinnedEntities = pinnedEntities.filter((entityId) => {
    return entityId !== id
  })

  cookies.set(`pinned_` + entityType, JSON.stringify(pinnedEntities));

  return pinnedEntities;
};

export const api = axios.create({
  timeout: 10000,  
});

export const isProd = process.env.NODE_ENV === 'production';
export const protocol = isProd ? 'https://' : 'http://'
export const SITE_URL = protocol + isProd ? process.env.NEXT_PUBLIC_VERCEL_URL : 'localhost:3000'

export const fetcher = (url: string) => api.get(url).then(res => res.data)

