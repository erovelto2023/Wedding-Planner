import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('wedding-planner');
    
    const proposal = await db.collection('proposals').findOne({ 
      _id: new ObjectId(id),
      userId: (session.user as any).id 
    });
    
    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }
    
    return NextResponse.json({ ...proposal, _id: proposal._id.toString() });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch proposal' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('wedding-planner');
    const updateData = await request.json();
    
    const { _id, userId, ...dataToUpdate } = updateData;
    
    const result = await db.collection('proposals').updateOne(
      { _id: new ObjectId(id), userId: (session.user as any).id },
      { $set: dataToUpdate }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Proposal not found or unauthorized' }, { status: 404 });
    }

    // Auto-convert to invoice if accepted
    if (dataToUpdate.status === 'Accepted') {
      const existingInvoice = await db.collection('invoices').findOne({ sourceProposalId: new ObjectId(id) });
      if (!existingInvoice) {
        const proposal = await db.collection('proposals').findOne({ _id: new ObjectId(id) });
        if (proposal) {
          const invoiceBlock = proposal.blocks.find((b: any) => b.type === 'invoice');
          if (invoiceBlock) {
            const headerBlock = proposal.blocks.find((b: any) => b.type === 'header');
            const clientName = headerBlock?.type === 'header' ? headerBlock.content.clientName : 'Unknown Client';
            const items = invoiceBlock.type === 'invoice' ? invoiceBlock.content.items : [];
            const amount = items.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0);

            await db.collection('invoices').insertOne({
              userId: (session.user as any).id,
              clientName,
              amount,
              status: 'pending',
              date: new Date().toISOString().split('T')[0],
              items,
              createdAt: new Date(),
              sourceProposalId: new ObjectId(id)
            });
          }
        }
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update proposal:', error);
    return NextResponse.json({ error: 'Failed to update proposal' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('wedding-planner');
    
    const result = await db.collection('proposals').deleteOne({ 
      _id: new ObjectId(id),
      userId: (session.user as any).id 
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Proposal not found or unauthorized' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete proposal' }, { status: 500 });
  }
}
