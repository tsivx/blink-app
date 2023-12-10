import { getPinnedEntities } from '@/utils/blink';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface GetPinnedEntitiesParams {
  entity: string;
}

export async function GET(req: NextRequest, ctx: { params: GetPinnedEntitiesParams }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const pinnedEntities = getPinnedEntities(cookieStore, ctx.params.entity);

  const { data: entities, error } = await supabase
    .from(ctx.params.entity)
    .select('*, college:colleges (*)')
    .in('id', pinnedEntities)
    .throwOnError();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(entities);
}