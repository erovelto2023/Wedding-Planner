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

    const tasks = await db.collection('tasks').find({ userId }).toArray();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
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
    const newTask = {
      userId,
      title: body.title,
      dueDate: body.dueDate || null,
      priority: body.priority || 'Medium',
      category: body.category || 'Planning',
      completed: false,
      createdAt: new Date()
    };

    const result = await db.collection('tasks').insertOne(newTask);
    return NextResponse.json({ ...newTask, _id: result.insertedId.toString() });
  } catch (error) {
    console.error('Failed to create task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
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
    const { _id, title, completed, dueDate, priority, category } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }

    const updateFields: any = {};
    if (title !== undefined) updateFields.title = title;
    if (completed !== undefined) updateFields.completed = completed;
    if (dueDate !== undefined) updateFields.dueDate = dueDate;
    if (priority !== undefined) updateFields.priority = priority;
    if (category !== undefined) updateFields.category = category;

    const result = await db.collection('tasks').updateOne(
      { _id: new ObjectId(_id), userId },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Task not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
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
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }

    const result = await db.collection('tasks').deleteOne({
      _id: new ObjectId(id),
      userId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Task not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
