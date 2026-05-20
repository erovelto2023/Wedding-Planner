import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('wedding-planner');
    const userId = (session.user as any).id;

    const legal = await db.collection('legal').findOne({ userId });
    return NextResponse.json(legal || {});
  } catch (error) {
    console.error('Failed to fetch legal data:', error);
    return NextResponse.json({ error: 'Failed to fetch legal data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('wedding-planner');
    const userId = (session.user as any).id;

    const body = await request.json();
    
    await db.collection('legal').updateOne(
      { userId },
      { $set: { ...body, userId } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update legal data:', error);
    return NextResponse.json({ error: 'Failed to update legal data' }, { status: 500 });
  }
}
