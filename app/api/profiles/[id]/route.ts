import { ProfileRow } from '@/types';
import { getPinnedProfileIds } from '@/utils/blink';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface GetProfileByIdProps {
  id: number;
}

export async function GET(req: NextRequest, ctx: { params: GetProfileByIdProps }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*, college:colleges (id, name)')
    .eq('id', ctx.params.id)
    .limit(1)
    .returns<ProfileRow[]>()
    .single();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  const pinnedProfiles = getPinnedProfileIds(cookieStore);
  profile.pinned = pinnedProfiles.includes(profile.id);

  return NextResponse.json(profile);
}
