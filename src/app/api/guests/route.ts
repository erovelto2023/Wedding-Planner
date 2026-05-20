import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { ObjectId } from 'mongodb';

// Default guests to populate if empty
const defaultGuests = [
  { name: 'John Smith', meal: 'Beef', dietary: 'None', status: 'Confirmed' },
  { name: 'Jane Doe', meal: 'Fish', dietary: 'Gluten Free', status: 'Confirmed' },
  { name: 'Uncle Bob', meal: 'Vegetarian', dietary: 'Nut Allergy', status: 'Pending' },
  { name: 'Aunt Alice', meal: 'Beef', dietary: 'None', status: 'Confirmed' },
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
    
    const items = await db.collection('guests').find({ userId }).toArray();
    
    if (items.length === 0) {
      const itemsToInsert = defaultGuests.map(item => ({ ...item, userId }));
      await db.collection('guests').insertMany(itemsToInsert);
      const newItems = await db.collection('guests').find({ userId }).toArray();
      return NextResponse.json(newItems);
    }
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to fetch guests:', error);
    return NextResponse.json({ error: 'Failed to fetch guests' }, { status: 500 });
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
    
    const result = await db.collection('guests').insertOne(itemData);
    return NextResponse.json({ ...itemData, _id: result.insertedId.toString() });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add guest' }, { status: 500 });
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
    
    const result = await db.collection('guests').updateOne(
      { _id: new ObjectId(_id), userId: (session.user as any).id },
      { $set: dataToUpdate }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Guest not found or unauthorized' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update guest' }, { status: 500 });
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
    
    const result = await db.collection('guests').deleteOne({ 
      _id: new ObjectId(id),
      userId: (session.user as any).id 
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Guest not found or unauthorized' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete guest' }, { status: 500 });
  }
}
