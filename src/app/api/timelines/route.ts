import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { ObjectId } from 'mongodb';

// Default timeline events to populate if empty
const defaultEvents = [
  { time: '09:00', event: 'Getting Ready', category: 'Preparation', location: 'Hotel/Home' },
  { time: '12:00', event: 'Vendor Arrival', category: 'Logistics', location: 'Venue' },
  { time: '14:00', event: 'First Look & Photos', category: 'Photos', location: 'Venue Gardens' },
  { time: '16:00', event: 'Guest Arrival', category: 'Ceremony', location: 'Ceremony Site' },
  { time: '16:30', event: 'Ceremony Starts', category: 'Ceremony', location: 'Ceremony Site' },
  { time: '17:00', event: 'Cocktail Hour', category: 'Reception', location: 'Bar Area' },
  { time: '18:15', event: 'Grand Entrance', category: 'Reception', location: 'Reception Hall' },
  { time: '18:30', event: 'Dinner Service', category: 'Reception', location: 'Reception Hall' },
  { time: '20:00', event: 'First Dance', category: 'Reception', location: 'Dance Floor' },
  { time: '22:30', event: 'Last Call', category: 'Reception', location: 'Bar' },
  { time: '23:00', event: 'Grand Send-Off', category: 'Reception', location: 'Exit' },
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
    
    const items = await db.collection('timeline').find({ userId }).toArray();
    
    if (items.length === 0) {
      // Populate with default items
      const itemsToInsert = defaultEvents.map(item => ({ ...item, userId }));
      await db.collection('timeline').insertMany(itemsToInsert);
      const newItems = await db.collection('timeline').find({ userId }).toArray();
      return NextResponse.json(newItems.sort((a, b) => a.time.localeCompare(b.time)));
    }
    
    return NextResponse.json(items.sort((a, b) => a.time.localeCompare(b.time)));
  } catch (error) {
    console.error('Failed to fetch timeline:', error);
    return NextResponse.json({ error: 'Failed to fetch timeline' }, { status: 500 });
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
    const item = await request.json();
    
    const itemData = {
      ...item,
      userId: (session.user as any).id
    };
    
    const result = await db.collection('timeline').insertOne(itemData);
    return NextResponse.json({ ...itemData, _id: result.insertedId.toString() });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add timeline event' }, { status: 500 });
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
    const item = await request.json();
    
    const { _id, userId, ...dataToUpdate } = item;
    
    const result = await db.collection('timeline').updateOne(
      { _id: new ObjectId(_id), userId: (session.user as any).id },
      { $set: dataToUpdate }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Item not found or unauthorized' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update timeline event' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('wedding-planner');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const result = await db.collection('timeline').deleteOne({ 
      _id: new ObjectId(id),
      userId: (session.user as any).id 
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Item not found or unauthorized' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete timeline event' }, { status: 500 });
  }
}
