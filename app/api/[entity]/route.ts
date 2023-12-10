import { allowedEntities } from '@/utils/blink';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface GetEntityListParams {
  entity: string;
}

export async function GET(req: NextRequest, ctx: { params: GetEntityListParams }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (!allowedEntities.includes(ctx.params.entity)) {
    return NextResponse.json({ error: 'Entity not allowed' }, { status: 400 });
  }

  const { data, error } = await supabase.from(ctx.params.entity).select('*, college:colleges (*)');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
