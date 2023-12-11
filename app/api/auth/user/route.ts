import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    const { data: user, error } = await supabase.from('profiles').select('*').eq('auth_id', session.user.id).single();

    if (error) {
      return NextResponse.json(error, { status: 500 });
    }

    return NextResponse.json(user);
  }

  return NextResponse.json({ error: 'Auth needed' }, { status: 401 });
}