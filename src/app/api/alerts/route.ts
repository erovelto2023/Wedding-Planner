import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('wedding-planner');
    const userId = (session.user as any).id;

    const alerts = await db.collection('custom_alerts').find({ userId, acknowledged: { $ne: true } }).toArray();
    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Failed to fetch custom alerts:', error);
    return NextResponse.json({ error: 'Failed to fetch custom alerts' }, { status: 500 });
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
    const newAlert = {
      userId,
      message: body.message,
      project: body.project || 'General Reminder',
      type: body.type || 'warning', // 'danger' | 'warning'
      acknowledged: false,
      createdAt: new Date()
    };

    const result = await db.collection('custom_alerts').insertOne(newAlert);
    return NextResponse.json({ ...newAlert, _id: result.insertedId.toString() });
  } catch (error) {
    console.error('Failed to create custom alert:', error);
    return NextResponse.json({ error: 'Failed to create custom alert' }, { status: 500 });
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
    const { _id, acknowledged } = body;

    if (!_id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const result = await db.collection('custom_alerts').updateOne(
      { _id: new ObjectId(_id), userId },
      { $set: { acknowledged: acknowledged === true } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Alert not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update custom alert:', error);
    return NextResponse.json({ error: 'Failed to update custom alert' }, { status: 500 });
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

    const result = await db.collection('custom_alerts').deleteOne({
      _id: new ObjectId(id),
      userId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Alert not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete custom alert:', error);
    return NextResponse.json({ error: 'Failed to delete custom alert' }, { status: 500 });
  }
}
