import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

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
      return NextResponse.json(newLogs.map(l => l.message));
    }
    
    return NextResponse.json(logs.map(l => l.message));
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

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedMessage = `📢 [${timeStr}] ${message}`;

    const newLog = {
      userId,
      message: formattedMessage,
      createdAt: new Date()
    };

    await db.collection('transportation_logs').insertOne(newLog);
    return NextResponse.json({ success: true, message: formattedMessage });
  } catch (error) {
    console.error('Failed to post operational log:', error);
    return NextResponse.json({ error: 'Failed to post operational log' }, { status: 500 });
  }
}
