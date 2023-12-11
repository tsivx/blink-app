import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface GetCollegeByIdProps {
  id: number;
}

export async function GET(req: NextRequest, ctx: { params: GetCollegeByIdProps }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('colleges')
    .select('*')
    .eq('id', ctx.params.id)
    .single();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json(data);
}
