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

    const prenup = await db.collection('prenups').findOne({ userId });
    return NextResponse.json(prenup || { brideAnswers: {}, groomAnswers: {} });
  } catch (error) {
    console.error('Failed to fetch prenup data:', error);
    return NextResponse.json({ error: 'Failed to fetch prenup data' }, { status: 500 });
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
    
    await db.collection('prenups').updateOne(
      { userId },
      { $set: { ...body, userId } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update prenup data:', error);
    return NextResponse.json({ error: 'Failed to update prenup data' }, { status: 500 });
  }
}
