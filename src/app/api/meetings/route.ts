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

    const meetings = await db.collection('meetings').find({ userId }).toArray();
    return NextResponse.json(meetings);
  } catch (error) {
    console.error('Failed to fetch meetings:', error);
    return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 500 });
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
    const newMeeting = {
      userId,
      title: body.title,
      time: body.time,
      date: body.date,
      createdAt: new Date()
    };

    const result = await db.collection('meetings').insertOne(newMeeting);
    return NextResponse.json({ ...newMeeting, _id: result.insertedId });
  } catch (error) {
    console.error('Failed to create meeting:', error);
    return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 });
  }
}
