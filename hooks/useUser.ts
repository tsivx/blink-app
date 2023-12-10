'use client';

import { fetcher } from '@/utils/blink';
import useSWR from 'swr';

export function useUser() {
  const { data, error } = useSWR(`/api/auth/user`, fetcher);

  return {
    user: error ? undefined : data,
  };
}
