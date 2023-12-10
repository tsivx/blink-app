import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase.auth.getSession();

  if (data.session) {
    return NextResponse.json(data.session.user);
  }

  return NextResponse.json({ error: 'Auth needed' }, { status: 401 });
}