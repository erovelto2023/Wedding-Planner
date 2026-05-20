import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('wedding-planner');
    
    const settings = await db.collection('company_settings').findOne({ userId: (session.user as any).id });
    
    if (!settings) {
      // Return default empty settings if none exist
      return NextResponse.json({
        companyName: 'My Company',
        address: '',
        phone: '',
        website: '',
        logoUrl: ''
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch company settings' }, { status: 500 });
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
    const settings = await request.json();
    
    const { _id, ...settingsData } = settings;
    settingsData.userId = (session.user as any).id;
    
    await db.collection('company_settings').updateOne(
      { userId: (session.user as any).id },
      { $set: settingsData },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save company settings:', error);
    return NextResponse.json({ error: 'Failed to save company settings' }, { status: 500 });
  }
}
