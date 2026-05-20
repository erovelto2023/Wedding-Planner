import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { ObjectId } from 'mongodb';

// Default layouts to populate if empty
const defaultLayouts = [
  {
    name: 'Grand Ballroom (Default)',
    objects: [
      { id: '1', type: 'table', shape: 'round', x: 100, y: 100, width: 72, height: 72, label: 'Table 1', color: '#E3F2FD', icon: '⭕', assignedGuests: [] },
      { id: '2', type: 'table', shape: 'round', x: 300, y: 100, width: 72, height: 72, label: 'Table 2', color: '#E3F2FD', icon: '⭕', assignedGuests: [] },
      { id: '3', type: 'dancefloor', shape: 'rectangle', x: 200, y: 300, width: 200, height: 150, label: 'Dance Floor', color: '#FFF9C4', icon: '💃', assignedGuests: [] }
    ]
  },
  {
    name: 'Intimate Dinner',
    objects: [
      { id: '1', type: 'table', shape: 'rectangle', x: 100, y: 100, width: 144, height: 36, label: 'Head Table', color: '#BBDEFB', icon: '👑', assignedGuests: [] },
      { id: '2', type: 'table', shape: 'round', x: 50, y: 200, width: 60, height: 60, label: 'Table 1', color: '#E3F2FD', icon: '⭕', assignedGuests: [] },
      { id: '3', type: 'table', shape: 'round', x: 150, y: 200, width: 60, height: 60, label: 'Table 2', color: '#E3F2FD', icon: '⭕', assignedGuests: [] },
      { id: '4', type: 'table', shape: 'round', x: 250, y: 200, width: 60, height: 60, label: 'Table 3', color: '#E3F2FD', icon: '⭕', assignedGuests: [] },
    ]
  },
  {
    name: 'Cocktail Reception',
    objects: [
      { id: '1', type: 'bar', shape: 'rectangle', x: 50, y: 50, width: 120, height: 30, label: 'Main Bar', color: '#C8E6C9', icon: '🍻', assignedGuests: [] },
      { id: '2', type: 'table', shape: 'round', x: 100, y: 150, width: 30, height: 30, label: 'High Top 1', color: '#E0E0E0', icon: '🍸', assignedGuests: [] },
      { id: '3', type: 'table', shape: 'round', x: 200, y: 150, width: 30, height: 30, label: 'High Top 2', color: '#E0E0E0', icon: '🍸', assignedGuests: [] },
      { id: '4', type: 'table', shape: 'round', x: 300, y: 150, width: 30, height: 30, label: 'High Top 3', color: '#E0E0E0', icon: '🍸', assignedGuests: [] },
      { id: '5', type: 'dj', shape: 'rectangle', x: 50, y: 300, width: 80, height: 40, label: 'DJ', color: '#CFD8DC', icon: '🎧', assignedGuests: [] },
    ]
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
    
    const items = await db.collection('floorplans').find({ userId }).toArray();
    
    // If no layouts exist, seed with defaults
    if (items.length === 0) {
      const itemsToInsert = defaultLayouts.map(item => ({ ...item, userId }));
      await db.collection('floorplans').insertMany(itemsToInsert);
      const newItems = await db.collection('floorplans').find({ userId }).toArray();
      return NextResponse.json(newItems);
    }
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to fetch floorplans:', error);
    return NextResponse.json({ error: 'Failed to fetch floorplans' }, { status: 500 });
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
    
    const result = await db.collection('floorplans').insertOne(itemData);
    return NextResponse.json({ ...itemData, _id: result.insertedId.toString() });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add floorplan' }, { status: 500 });
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
    
    const result = await db.collection('floorplans').updateOne(
      { _id: new ObjectId(_id), userId: (session.user as any).id },
      { $set: dataToUpdate }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Floorplan not found or unauthorized' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update floorplan' }, { status: 500 });
  }
}
