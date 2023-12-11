import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { email, password } = await req.json();
  const { data, error } = await supabase.auth.signInWithPassword({
    email, password 
  });

  if (error) {
    return NextResponse.json(error, { status: error.status });
  }

  const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('auth_id', data.user.id).single();

  if (profileError) {
    return NextResponse.json(profileError, { status: 500 });
  }

/*   if (!profile.length) {
    const { data: createdProfile, error: createProfileError } = await supabase.from('profiles').insert({
      auth_id: data.user.id,
      name: 'Admin',
      type: 'admin',
      college_id: 1
    }).select();

    if (createProfileError) {
      return NextResponse.json(createProfileError, { status: 500 });
    }

    return NextResponse.json(createdProfile);
  } */

  return NextResponse.json(profile);
}