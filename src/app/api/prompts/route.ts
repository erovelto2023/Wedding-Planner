import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import fs from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const client = await clientPromise;
    const db = client.db('wedding-planner');

    // Check if collection is empty
    const count = await db.collection('prompts').countDocuments();
    if (count === 0) {
      // Seed from JSON file
      const filePath = path.join(process.cwd(), 'src', 'data', 'prompts.json');
      const fileData = fs.readFileSync(filePath, 'utf8');
      const initialPrompts = JSON.parse(fileData);
      
      // Add a flag or just insert them
      await db.collection('prompts').insertMany(initialPrompts);
    }

    let query: any = {};
    if (category) {
      query.category = category;
    }

    const prompts = await db.collection('prompts').find(query).toArray();
    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Failed to fetch prompts:', error);
    return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 });
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

    const body = await request.json();
    const newPrompt = {
      category: body.category,
      prompt: body.prompt,
      createdAt: new Date()
    };

    const result = await db.collection('prompts').insertOne(newPrompt);
    return NextResponse.json({ ...newPrompt, _id: result.insertedId });
  } catch (error) {
    console.error('Failed to create prompt:', error);
    return NextResponse.json({ error: 'Failed to create prompt' }, { status: 500 });
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

    const body = await request.json();
    const { id, prompt, category } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing prompt ID' }, { status: 400 });
    }

    const result = await db.collection('prompts').updateOne(
      { _id: new ObjectId(id) },
      { $set: { prompt, category, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update prompt:', error);
    return NextResponse.json({ error: 'Failed to update prompt' }, { status: 500 });
  }
}
