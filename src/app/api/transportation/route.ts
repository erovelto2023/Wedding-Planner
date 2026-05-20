import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { ObjectId } from 'mongodb';

const defaultTransportation = [
  {
    name: 'Guest Shuttle Alpha',
    type: 'Luxury Shuttle Bus',
    route: 'Westin Hotel ➔ Ceremony Venue',
    time: '14:30',
    capacity: 24,
    driverName: 'Robert Vance',
    driverPhone: '555-0141',
    status: 'Scheduled',
    assignedGuests: []
  },
  {
    name: 'Bridal Party Limo',
    type: 'Stretch Limousine',
    route: 'Grand Plaza Hotel ➔ Ceremony Venue',
    time: '15:00',
    capacity: 10,
    driverName: 'Michael Scott',
    driverPhone: '555-0199',
    status: 'Scheduled',
    assignedGuests: []
  },
  {
    name: 'Vintage Getaway Car',
    type: 'Classic Rolls Royce',
    route: 'Reception Venue ➔ Airport Hotel',
    time: '23:30',
    capacity: 2,
    driverName: 'Alfred Pennyworth',
    driverPhone: '555-0077',
    status: 'Scheduled',
    assignedGuests: []
  }
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
    
    const items = await db.collection('transportation').find({ userId }).toArray();
    
    if (items.length === 0) {
      const itemsToInsert = defaultTransportation.map(item => ({ ...item, userId }));
      await db.collection('transportation').insertMany(itemsToInsert);
      const newItems = await db.collection('transportation').find({ userId }).toArray();
      return NextResponse.json(newItems);
    }
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to fetch transportation:', error);
    return NextResponse.json({ error: 'Failed to fetch transportation' }, { status: 500 });
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
      assignedGuests: item.assignedGuests || [],
      userId: (session.user as any).id
    };
    
    const result = await db.collection('transportation').insertOne(itemData);
    return NextResponse.json({ ...itemData, _id: result.insertedId.toString() });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add vehicle' }, { status: 500 });
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
    
    const result = await db.collection('transportation').updateOne(
      { _id: new ObjectId(_id), userId: (session.user as any).id },
      { $set: dataToUpdate }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Vehicle not found or unauthorized' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 });
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
    
    const result = await db.collection('transportation').deleteOne({ 
      _id: new ObjectId(id),
      userId: (session.user as any).id 
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Vehicle not found or unauthorized' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 });
  }
}
