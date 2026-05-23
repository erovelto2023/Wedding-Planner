import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { ObjectId } from 'mongodb';

const defaultLogs = [
  "📢 Driver Robert Vance checked in: Shuttle has arrived at Westin Hotel (14:15)",
  "📢 Driver Michael Scott checked in: Limo is prepped & polished (14:45)",
  "⚠️ Alfred Pennyworth Alert: Road closure on route—rerouting getaway car via Scenic Expressway."
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
    
    // Fetch logs sorted by newest first
    const logs = await db.collection('transportation_logs')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
      
    if (logs.length === 0) {
      // Seed default logs for this user
      const now = Date.now();
      const logsToInsert = defaultLogs.map((msg, index) => ({
        userId,
        message: msg,
        // Space them out slightly to preserve order
        createdAt: new Date(now - (3 - index) * 60000)
      }));
      await db.collection('transportation_logs').insertMany(logsToInsert);
      
      const newLogs = await db.collection('transportation_logs')
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();
      return NextResponse.json(newLogs);
    }
    
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Failed to fetch operational logs:', error);
    return NextResponse.json({ error: 'Failed to fetch operational logs' }, { status: 500 });
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
    const { message } = await request.json();
    const userId = (session.user as any).id;
    
    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // If message already starts with a prefix tag/time, keep it, otherwise format
    let formattedMessage = message;
    if (!message.startsWith('📢') && !message.startsWith('⚠️')) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      formattedMessage = `📢 [${timeStr}] ${message}`;
    }

    const newLog = {
      userId,
      message: formattedMessage,
      createdAt: new Date()
    };

    const result = await db.collection('transportation_logs').insertOne(newLog);
    return NextResponse.json({ ...newLog, _id: result.insertedId.toString() });
  } catch (error) {
    console.error('Failed to post operational log:', error);
    return NextResponse.json({ error: 'Failed to post operational log' }, { status: 500 });
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
    const { _id, message } = await request.json();
    const userId = (session.user as any).id;
    
    if (!_id || !message || !message.trim()) {
      return NextResponse.json({ error: 'ID and message required' }, { status: 400 });
    }

    const result = await db.collection('transportation_logs').updateOne(
      { _id: new ObjectId(_id), userId },
      { $set: { message } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Log not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update operational log:', error);
    return NextResponse.json({ error: 'Failed to update operational log' }, { status: 500 });
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
    const userId = (session.user as any).id;
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const result = await db.collection('transportation_logs').deleteOne({
      _id: new ObjectId(id),
      userId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Log not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete operational log:', error);
    return NextResponse.json({ error: 'Failed to delete operational log' }, { status: 500 });
  }
}
