import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Proposal } from '@/types/proposal';
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
    
    const proposals = await db.collection('proposals').find({ userId: (session.user as any).id }).toArray();
    return NextResponse.json(proposals);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
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
    const proposal: Proposal = await request.json();
    
    if (!proposal.createdAt) {
      proposal.createdAt = new Date();
    }
    
    const proposalData = {
      ...proposal,
      userId: (session.user as any).id
    };
    
    const { _id, ...dataToInsert } = proposalData;
    
    const result = await db.collection('proposals').insertOne(dataToInsert);
    return NextResponse.json({ ...dataToInsert, _id: result.insertedId.toString() });
  } catch (error) {
    console.error('Failed to create proposal:', error);
    return NextResponse.json({ error: 'Failed to create proposal' }, { status: 500 });
  }
}
