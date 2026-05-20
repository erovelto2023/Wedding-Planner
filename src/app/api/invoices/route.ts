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

    const invoices = await db.collection('invoices').find({ userId }).toArray();
    return NextResponse.json(invoices.map(i => ({ ...i, _id: i._id.toString() })));
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
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
    const newInvoice = {
      userId,
      clientName: body.clientName,
      amount: body.amount,
      status: body.status || 'pending',
      date: body.date || new Date().toISOString().split('T')[0],
      items: body.items || [],
      payments: body.payments || [],
      milestone: body.milestone || '',
      createdAt: new Date()
    };

    const result = await db.collection('invoices').insertOne(newInvoice);
    return NextResponse.json({ ...newInvoice, _id: result.insertedId });
  } catch (error) {
    console.error('Failed to create invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('wedding-planner');
    const userId = (session.user as any).id;

    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updateData: any = { updatedAt: new Date() };
    if (body.status) updateData.status = body.status;
    if (body.clientName) updateData.clientName = body.clientName;
    if (body.amount !== undefined) updateData.amount = body.amount;
    if (body.date) updateData.date = body.date;
    if (body.items) updateData.items = body.items;
    if (body.payments) updateData.payments = body.payments;
    if (body.milestone) updateData.milestone = body.milestone;

    const result = await db.collection('invoices').updateOne(
      { _id: new ObjectId(id), userId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update invoice:', error);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}
