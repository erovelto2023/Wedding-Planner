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

    const data = await db.collection('bridal-shower').findOne({ userId });
    return NextResponse.json(data || { notFound: true });
  } catch (error) {
    console.error('Failed to fetch bridal shower data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('wedding-planner');
    const userId = (session.user as any).id;

    const body = await request.json();
    const { todos, gifts, details, notes } = body;

    const updatedDocument = {
      userId,
      todos: todos || [],
      gifts: gifts || [],
      details: details || {},
      notes: notes || [],
      updatedAt: new Date()
    };

    await db.collection('bridal-shower').updateOne(
      { userId },
      { $set: updatedDocument },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save bridal shower data:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
