import { addPinnedEntity, deletePinnedEntity, getPinnedEntities } from '@/utils/blink';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface GetPinnedEntityByIdParams {
  entity: string;
  id: number;
}

export async function GET(req: NextRequest, ctx: { params: GetPinnedEntityByIdParams }) {
  const cookieStore = cookies();

  const pinnedEntities = getPinnedEntities(cookieStore, ctx.params.entity);

  return NextResponse.json(pinnedEntities.includes(ctx.params.id));
}

export async function POST(req: NextRequest, ctx: { params: GetPinnedEntityByIdParams }) {
  const cookieStore = cookies();

  const pinnedEntities = addPinnedEntity(cookieStore, ctx.params.entity, ctx.params.id);

  return NextResponse.json(pinnedEntities);
}

export async function DELETE(req: NextRequest, ctx: { params: GetPinnedEntityByIdParams }) {
  const cookieStore = cookies();

  if (!ctx.params.id) {
    return NextResponse.json({ error: 'Необходимо указать объект для закрепления' }, { status: 400 });
  }

  const pinnedEntities = deletePinnedEntity(cookieStore, ctx.params.entity, ctx.params.id);

  return NextResponse.json(pinnedEntities);
}
