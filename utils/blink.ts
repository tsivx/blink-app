import dayjs from "@/utils/dayjs";
import axios from "axios";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const getPinnedProfileIds = (cookieStore: ReadonlyRequestCookies): number[] => {
  const cookie = cookieStore.get('pinned_profiles');
  const pinnedProfiles = cookie ? (JSON.parse(cookie.value) || []) : [];

  return pinnedProfiles;
};

export const pinProfile = (cookieStore: ReadonlyRequestCookies, id: number): number[] => {
  const cookie = cookieStore.get('pinned_profiles');
  const pinnedProfiles = cookie ? (JSON.parse(cookie.value) || []) : [];

  if (!pinnedProfiles.includes(id)) {
    pinnedProfiles.push(id);
  }

  cookieStore.set('pinned_profiles', JSON.stringify(pinnedProfiles), { expires: 10 * 365 * 24 * 60 * 60, maxAge: 10 * 365 * 24 * 60 * 60 });

  return pinnedProfiles;
}

export const unpinProfile = (cookieStore: ReadonlyRequestCookies, id: number): number[] => {
  const cookie = cookieStore.get('pinned_profiles');
  const pinnedProfiles = cookie ? (JSON.parse(cookie.value) || []) : [];

  const updated = pinnedProfiles.filter((profileId: number) => profileId !== id);

  cookieStore.set('pinned_profiles', JSON.stringify(updated), { expires: 10 * 365 * 24 * 60 * 60, maxAge: 10 * 365 * 24 * 60 * 60 });

  return updated;
}

export function dateToISO(date: string): string {
  return dayjs(date, 'D-MM-YYYY').format('YYYY-MM-DD');
}

export const api = axios.create({
  timeout: 10000,  
});

export const isProd = process.env.NODE_ENV === 'production';
export const protocol = isProd ? 'https://' : 'http://'
export const SITE_URL = protocol + isProd ? process.env.NEXT_PUBLIC_SITE_URL : 'localhost:3000'

export const fetcher = (url: string) => api.get(url).then(res => res.data)

