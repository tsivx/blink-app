import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const searchParams = req.nextUrl.searchParams;

  // Filters
  const type = searchParams.get('type');
  const collegeId = searchParams.get('college_id');
  const course = searchParams.get('course');

  let query = supabase.from('profiles').select('*, college:colleges (id, name)');

  if (type) {
    query = query.eq('type', type);
  }

  if (collegeId) {
    query = query.eq('college_id', collegeId);
  }

  if (course) {
    query = query.eq('metadata->>course', course);
  }

  const { data: profiles, error } = await query;

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json(profiles);
}
