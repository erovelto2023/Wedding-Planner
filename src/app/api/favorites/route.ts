import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found in session' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('wedding-planner');

    const favorites = await db.collection('favorites').find({ userEmail }).toArray();
    
    // Return array of prompt IDs
    const promptIds = favorites.map(f => f.promptId.toString());
    return NextResponse.json(promptIds);
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found in session' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('wedding-planner');

    const body = await request.json();
    const { promptId } = body;

    if (!promptId) {
      return NextResponse.json({ error: 'Missing prompt ID' }, { status: 400 });
    }

    // Check if already favorited
    const existing = await db.collection('favorites').findOne({
      userEmail,
      promptId: new ObjectId(promptId)
    });

    if (existing) {
      return NextResponse.json({ message: 'Already favorited' });
    }

    await db.collection('favorites').insertOne({
      userEmail,
      promptId: new ObjectId(promptId),
      createdAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to add favorite:', error);
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found in session' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('wedding-planner');

    const { searchParams } = new URL(request.url);
    const promptId = searchParams.get('promptId');

    if (!promptId) {
      return NextResponse.json({ error: 'Missing prompt ID' }, { status: 400 });
    }

    const result = await db.collection('favorites').deleteOne({
      userEmail,
      promptId: new ObjectId(promptId)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to remove favorite:', error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}
