import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { ObjectId } from 'mongodb';

// Default vendors updated with specific fields
const defaultVendors = [
  { 
    name: 'Elite Photography', 
    category: 'Photography',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    phone: '555-0192',
    contact: 'John Doe',
    email: 'john@elitephoto.com',
    website: 'https://elitephoto.com',
    notes: 'Preferred photographer for luxury weddings.'
  },
  { 
    name: 'Gourmet Catering', 
    category: 'Catering',
    address: '456 Foodie Lane',
    city: 'Brooklyn',
    state: 'NY',
    zip: '11201',
    phone: '555-0193',
    contact: 'Jane Smith',
    email: 'info@gourmetcatering.com',
    website: 'https://gourmetcatering.com',
    notes: 'Excellent French-inspired menu.'
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
    
    const items = await db.collection('vendors').find({ userId }).toArray();
    
    if (items.length === 0) {
      const itemsToInsert = defaultVendors.map(item => ({ ...item, userId }));
      await db.collection('vendors').insertMany(itemsToInsert);
      const newItems = await db.collection('vendors').find({ userId }).toArray();
      return NextResponse.json(newItems);
    }
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to fetch vendors:', error);
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
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
    
    const result = await db.collection('vendors').insertOne(itemData);
    return NextResponse.json({ ...itemData, _id: result.insertedId.toString() });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add vendor' }, { status: 500 });
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
    
    const result = await db.collection('vendors').updateOne(
      { _id: new ObjectId(_id), userId: (session.user as any).id },
      { $set: dataToUpdate }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Vendor not found or unauthorized' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 });
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
    
    const result = await db.collection('vendors').deleteOne({ 
      _id: new ObjectId(id),
      userId: (session.user as any).id 
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Vendor not found or unauthorized' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 });
  }
}
