import { getPinnedProfileIds, pinProfile, unpinProfile } from "@/utils/blink";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const pinnedProfiles = getPinnedProfileIds(cookieStore);
  const supabase = createClient(cookieStore);

  const { data: profiles } = await supabase.from('profiles').select('*').in('id', pinnedProfiles);

  return NextResponse.json(profiles);
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const { id } = await req.json();
  
  const pinnedProfiles = pinProfile(cookieStore, id);

  return NextResponse.json(pinnedProfiles);
}

export async function DELETE(req: NextRequest) {
  const cookieStore = cookies();
  const { id } = await req.json();

  const pinnedProfiles = unpinProfile(cookieStore, id);

  return NextResponse.json(pinnedProfiles);
}