import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { ObjectId } from 'mongodb';

// Default initial seeds
const defaultItems = [
  { name: 'KitchenAid Artisan Series Stand Mixer', store: 'Amazon', price: 449.99, category: 'Kitchen', status: 'Available', priority: 'High', guestName: '' },
  { name: 'Dyson V15 Detect Cordless Vacuum', store: 'Target', price: 749.99, category: 'Home Care', status: 'Purchased', priority: 'High', guestName: 'Aunt Linda' },
  { name: 'Boll & Branch Signature Sheet Set', store: 'Boutique', price: 299.00, category: 'Bedding', status: 'Purchased', priority: 'Medium', guestName: 'Uncle Bob' },
  { name: 'Le Creuset Signature Round Dutch Oven', store: 'Crate & Barrel', price: 379.95, category: 'Kitchen', status: 'Available', priority: 'Medium', guestName: '' },
  { name: 'Premium Waffle Bath Towel Set', store: 'Etsy', price: 95.00, category: 'Bath', status: 'Available', priority: 'Low', guestName: '' }
];

const defaultFunds = [
  { name: 'Honeymoon Airfare & Dining Fund', target: 5000, raised: 2450, description: 'Help us fly first-class and enjoy romantic private sunset beach dinners!' },
  { name: 'New Home Cozy Down Payment', target: 15000, raised: 4800, description: 'We are saving up to buy our first cozy home together. Contributions are deeply appreciated!' },
  { name: 'Couples Weekly Date Night Fund', target: 1200, raised: 650, description: 'Keep the romance going! Contributions fund cooking classes and theater nights.' }
];

const defaultNotes = [
  { giftName: 'Dyson V15 Detect Cordless Vacuum', guestName: 'Aunt Linda', noteDraft: 'Dear Aunt Linda, Thank you so much for the incredible Dyson Cordless Vacuum! We are absolutely thrilled to have this for our new home. We loved having you celebrate with us!', status: 'Pending' },
  { giftName: 'Boll & Branch Signature Sheet Set', guestName: 'Uncle Bob', noteDraft: 'Dear Uncle Bob, Thank you so much for the luxurious Signature Sheet Set! Sleeping on these will feel like a five-star hotel. It meant the world to have you at our wedding!', status: 'Sent' }
];

const defaultReturns = [
  { name: 'Duplicate Blender (Received two)', action: 'Return', status: 'Pending', returnDeadline: '2026-06-30' },
  { name: 'Bed Sheets (Wrong bed size registered)', action: 'Exchange', status: 'Pending', returnDeadline: '2026-07-15' }
];

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const userId = (session.user as any).id;

    const client = await clientPromise;
    const db = client.db('wedding-planner');

    if (type === 'items') {
      const items = await db.collection('registry_items').find({ userId }).toArray();
      if (items.length === 0) {
        await db.collection('registry_items').insertMany(defaultItems.map(i => ({ ...i, userId })));
        return NextResponse.json(await db.collection('registry_items').find({ userId }).toArray());
      }
      return NextResponse.json(items);
    }

    if (type === 'funds') {
      const funds = await db.collection('registry_funds').find({ userId }).toArray();
      if (funds.length === 0) {
        await db.collection('registry_funds').insertMany(defaultFunds.map(f => ({ ...f, userId })));
        return NextResponse.json(await db.collection('registry_funds').find({ userId }).toArray());
      }
      return NextResponse.json(funds);
    }

    if (type === 'notes') {
      const notes = await db.collection('registry_notes').find({ userId }).toArray();
      if (notes.length === 0) {
        await db.collection('registry_notes').insertMany(defaultNotes.map(n => ({ ...n, userId })));
        return NextResponse.json(await db.collection('registry_notes').find({ userId }).toArray());
      }
      return NextResponse.json(notes);
    }

    if (type === 'returns') {
      const returns = await db.collection('registry_returns').find({ userId }).toArray();
      if (returns.length === 0) {
        await db.collection('registry_returns').insertMany(defaultReturns.map(r => ({ ...r, userId })));
        return NextResponse.json(await db.collection('registry_returns').find({ userId }).toArray());
      }
      return NextResponse.json(returns);
    }

    // Default fetch all aggregated
    const [items, funds, notes, returns] = await Promise.all([
      db.collection('registry_items').find({ userId }).toArray(),
      db.collection('registry_funds').find({ userId }).toArray(),
      db.collection('registry_notes').find({ userId }).toArray(),
      db.collection('registry_returns').find({ userId }).toArray()
    ]);

    // Seed defaults if empty inside aggregation
    let finalItems = items;
    if (items.length === 0) {
      await db.collection('registry_items').insertMany(defaultItems.map(i => ({ ...i, userId })));
      finalItems = await db.collection('registry_items').find({ userId }).toArray();
    }

    let finalFunds = funds;
    if (funds.length === 0) {
      await db.collection('registry_funds').insertMany(defaultFunds.map(f => ({ ...f, userId })));
      finalFunds = await db.collection('registry_funds').find({ userId }).toArray();
    }

    let finalNotes = notes;
    if (notes.length === 0) {
      await db.collection('registry_notes').insertMany(defaultNotes.map(n => ({ ...n, userId })));
      finalNotes = await db.collection('registry_notes').find({ userId }).toArray();
    }

    let finalReturns = returns;
    if (returns.length === 0) {
      await db.collection('registry_returns').insertMany(defaultReturns.map(r => ({ ...r, userId })));
      finalReturns = await db.collection('registry_returns').find({ userId }).toArray();
    }

    return NextResponse.json({
      items: finalItems,
      funds: finalFunds,
      notes: finalNotes,
      returns: finalReturns
    });

  } catch (error) {
    console.error('Registry API GET Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve registry items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const userId = (session.user as any).id;

    const client = await clientPromise;
    const db = client.db('wedding-planner');
    const body = await request.json();

    if (type === 'items') {
      const itemData = {
        userId,
        name: body.name || 'Custom Registry Item',
        store: body.store || 'Amazon',
        price: Number(body.price || 0),
        category: body.category || 'General',
        status: body.status || 'Available',
        priority: body.priority || 'Medium',
        guestName: body.guestName || ''
      };
      const result = await db.collection('registry_items').insertOne(itemData);
      return NextResponse.json({ ...itemData, _id: result.insertedId.toString() });
    }

    if (type === 'funds') {
      const fundData = {
        userId,
        name: body.name || 'New Cozy Fund',
        target: Number(body.target || 0),
        raised: Number(body.raised || 0),
        description: body.description || ''
      };
      const result = await db.collection('registry_funds').insertOne(fundData);
      return NextResponse.json({ ...fundData, _id: result.insertedId.toString() });
    }

    if (type === 'notes') {
      const noteData = {
        userId,
        giftName: body.giftName || 'General Gift',
        guestName: body.guestName || 'Anonymous Friend',
        noteDraft: body.noteDraft || 'Thank you for your generous gift!',
        status: body.status || 'Pending'
      };
      const result = await db.collection('registry_notes').insertOne(noteData);
      return NextResponse.json({ ...noteData, _id: result.insertedId.toString() });
    }

    if (type === 'returns') {
      const returnData = {
        userId,
        name: body.name || 'Duplicate Gift',
        action: body.action || 'Return',
        status: body.status || 'Pending',
        returnDeadline: body.returnDeadline || new Date().toISOString().split('T')[0]
      };
      const result = await db.collection('registry_returns').insertOne(returnData);
      return NextResponse.json({ ...returnData, _id: result.insertedId.toString() });
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('Registry API POST Error:', error);
    return NextResponse.json({ error: 'Failed to create registry item' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const userId = (session.user as any).id;

    const client = await clientPromise;
    const db = client.db('wedding-planner');
    const body = await request.json();

    const { _id, userId: bodyUserId, ...dataToUpdate } = body;
    if (!_id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const collectionName = 
      type === 'items' ? 'registry_items' : 
      type === 'funds' ? 'registry_funds' : 
      type === 'notes' ? 'registry_notes' : 
      type === 'returns' ? 'registry_returns' : null;

    if (!collectionName) {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    // Convert numeric fields
    if (type === 'items') {
      if (dataToUpdate.price !== undefined) dataToUpdate.price = Number(dataToUpdate.price);
    } else if (type === 'funds') {
      if (dataToUpdate.target !== undefined) dataToUpdate.target = Number(dataToUpdate.target);
      if (dataToUpdate.raised !== undefined) dataToUpdate.raised = Number(dataToUpdate.raised);
    }

    const result = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(_id), userId },
      { $set: dataToUpdate }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Item not found or unauthorized' }, { status: 404 });
    }

    // Special side effect: If a registry item is marked Purchased, automatically draft a new Thank-You note log!
    if (type === 'items' && dataToUpdate.status === 'Purchased' && dataToUpdate.guestName) {
      const existingNote = await db.collection('registry_notes').findOne({ userId, giftName: body.name, guestName: dataToUpdate.guestName });
      if (!existingNote) {
        const generatedDraft = `Dear ${dataToUpdate.guestName},\n\nThank you so much for the wonderful ${body.name}! We are absolutely thrilled to have this for our home together and cannot wait to use it. It meant so much to have you celebrate with us!\n\nWith love,\nEric & Partner`;
        await db.collection('registry_notes').insertOne({
          userId,
          giftName: body.name,
          guestName: dataToUpdate.guestName,
          noteDraft: generatedDraft,
          status: 'Pending'
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Registry API PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update registry item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const userId = (session.user as any).id;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const collectionName = 
      type === 'items' ? 'registry_items' : 
      type === 'funds' ? 'registry_funds' : 
      type === 'notes' ? 'registry_notes' : 
      type === 'returns' ? 'registry_returns' : null;

    if (!collectionName) {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('wedding-planner');

    const result = await db.collection(collectionName).deleteOne({
      _id: new ObjectId(id),
      userId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Item not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Registry API DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete registry item' }, { status: 500 });
  }
}
