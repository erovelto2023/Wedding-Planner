import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { ObjectId } from 'mongodb';

const defaultEvents = [
  { title: "Grand Ballroom Floral Mockup & Tasting", date: "2026-06-15", progress: 65 },
  { title: "Final Dress Fitting & Suit Tailoring", date: "2026-06-28", progress: 40 },
  { title: "Wedding Rehearsal & Bridal Dinner", date: "2026-07-10", progress: 85 }
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('wedding-planner');
    const userId = (session.user as any).id;

    let events = await db.collection('events').find({ userId }).toArray();
    if (events.length === 0) {
      const seeded = defaultEvents.map(e => ({ ...e, userId, createdAt: new Date() }));
      await db.collection('events').insertMany(seeded);
      events = await db.collection('events').find({ userId }).toArray();
    }
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
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
    const newEvent = {
      userId,
      title: body.title,
      date: body.date,
      progress: Number(body.progress || 0),
      createdAt: new Date()
    };

    const result = await db.collection('events').insertOne(newEvent);
    return NextResponse.json({ ...newEvent, _id: result.insertedId.toString() });
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
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
    const { _id, userId: bodyUserId, ...dataToUpdate } = body;

    if (!_id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    if (dataToUpdate.progress !== undefined) {
      dataToUpdate.progress = Number(dataToUpdate.progress);
    }

    const result = await db.collection('events').updateOne(
      { _id: new ObjectId(_id), userId },
      { $set: dataToUpdate }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Event not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = (session.user as any).id;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('wedding-planner');

    const result = await db.collection('events').deleteOne({
      _id: new ObjectId(id),
      userId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Event not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
