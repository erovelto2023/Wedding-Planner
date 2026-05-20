import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { ObjectId } from 'mongodb';

const defaultItems = [
  { category: 'Rings', item: 'Engagement Ring & Insurance', estimated: 0, actual: 0 },
  { category: 'Rings', item: 'Wedding Bands', estimated: 0, actual: 0 },
  { category: 'Pre-Wedding', item: 'Engagement Party Costs', estimated: 0, actual: 0 },
  { category: 'Pre-Wedding', item: 'Pre-Wedding Photography/Video', estimated: 0, actual: 0 },
  { category: 'Planners', item: 'Wedding Planner/Coordinator Fees', estimated: 0, actual: 0 },
  { category: 'Venue', item: 'Venue Rental Fee (Ceremony)', estimated: 0, actual: 0 },
  { category: 'Venue', item: 'Venue Rental Fee (Reception)', estimated: 0, actual: 0 },
  { category: 'Venue', item: 'Venue Staffing/Service Fees', estimated: 0, actual: 0 },
  { category: 'Venue', item: 'Venue Insurance/Liability Coverage', estimated: 0, actual: 0 },
  { category: 'Ceremony', item: 'Ceremony Officiant Fee', estimated: 0, actual: 0 },
  { category: 'Ceremony', item: 'Marriage License & Legal Fees', estimated: 0, actual: 0 },
  { category: 'Attire', item: 'Wedding Attire (Bride: Dress, Veil, Shoes, Undergarments, Alterations)', estimated: 0, actual: 0 },
  { category: 'Attire', item: 'Wedding Attire (Groom: Suit/Tux, Shoes, Accessories, Alterations)', estimated: 0, actual: 0 },
  { category: 'Attire', item: 'Bridal Party Attire (Dresses, Suits, Accessories)', estimated: 0, actual: 0 },
  { category: 'Attire', item: 'Attire Cleaning/Preservation', estimated: 0, actual: 0 },
  { category: 'Beauty', item: 'Hair & Makeup (Trial + Wedding Day)', estimated: 0, actual: 0 },
  { category: 'Beauty', item: 'Hair & Makeup for Bridal Party/Parents', estimated: 0, actual: 0 },
  { category: 'Beauty', item: 'Beauty Prep (Manicures, Pedicures, Skincare, Tanning)', estimated: 0, actual: 0 },
  { category: 'Beauty', item: 'Fitness/Wellness Pre-Wedding (Personal Trainer, Yoga, etc.)', estimated: 0, actual: 0 },
  { category: 'Catering', item: 'Catering: Food (Per-Person Cost)', estimated: 0, actual: 0 },
  { category: 'Catering', item: 'Catering: Beverages (Alcohol, Non-Alcoholic, Bar Service)', estimated: 0, actual: 0 },
  { category: 'Catering', item: 'Cake/Dessert Table', estimated: 0, actual: 0 },
  { category: 'Catering', item: 'Cake Cutting/Service Fee', estimated: 0, actual: 0 },
  { category: 'Catering', item: 'Vendor Meals (Required for photographers, DJs, etc.)', estimated: 0, actual: 0 },
  { category: 'Rentals', item: 'Rental Items (Tables, Chairs, Linens, Tableware)', estimated: 0, actual: 0 },
  { category: 'Decor', item: 'Decor: Centerpieces, Vases, Candles', estimated: 0, actual: 0 },
  { category: 'Decor', item: 'Decor: Ceremony Arch/Backdrop', estimated: 0, actual: 0 },
  { category: 'Decor', item: 'Decor: Aisle Runners, Petals, Signage', estimated: 0, actual: 0 },
  { category: 'Decor', item: 'Lighting (Uplighting, String Lights, Pin Spotting)', estimated: 0, actual: 0 },
  { category: 'Florals', item: 'Florals: Bridal Bouquet', estimated: 0, actual: 0 },
  { category: 'Florals', item: 'Florals: Boutonnieres, Corsages', estimated: 0, actual: 0 },
  { category: 'Florals', item: 'Florals: Ceremony Arrangements', estimated: 0, actual: 0 },
  { category: 'Florals', item: 'Florals: Reception Arrangements', estimated: 0, actual: 0 },
  { category: 'Florals', item: 'Delivery, Setup, & Breakdown Fees (Florals/Decor)', estimated: 0, actual: 0 },
  { category: 'Photo/Video', item: 'Photography Package (Engagement, Wedding Day, Prints)', estimated: 0, actual: 0 },
  { category: 'Photo/Video', item: 'Videography Package', estimated: 0, actual: 0 },
  { category: 'Photo/Video', item: 'Photo Booth Rental', estimated: 0, actual: 0 },
  { category: 'Photo/Video', item: 'Additional Photo/Video Add-ons (Drone, Same-Day Edit, etc.)', estimated: 0, actual: 0 },
  { category: 'Entertainment', item: 'Music/Entertainment: Ceremony Musicians', estimated: 0, actual: 0 },
  { category: 'Entertainment', item: 'Music/Entertainment: Reception DJ or Band', estimated: 0, actual: 0 },
  { category: 'Entertainment', item: 'Music Licensing Fees', estimated: 0, actual: 0 },
  { category: 'Entertainment', item: 'Audio/Visual Equipment Rental', estimated: 0, actual: 0 },
  { category: 'Transport', item: "Transportation: Couple's Getaway Car", estimated: 0, actual: 0 },
  { category: 'Transport', item: 'Transportation: Guest Shuttles/Buses', estimated: 0, actual: 0 },
  { category: 'Transport', item: 'Parking Fees/Valet Service', estimated: 0, actual: 0 },
  { category: 'Stationery', item: 'Wedding Website Domain & Hosting', estimated: 0, actual: 0 },
  { category: 'Stationery', item: 'Save-the-Dates (Design, Print, Postage)', estimated: 0, actual: 0 },
  { category: 'Stationery', item: 'Wedding Invitations (Design, Print, Assembly, Postage)', estimated: 0, actual: 0 },
  { category: 'Stationery', item: 'RSVP Cards & Envelopes', estimated: 0, actual: 0 },
  { category: 'Stationery', item: 'Day-Of Stationery (Programs, Menus, Place Cards, Signage)', estimated: 0, actual: 0 },
  { category: 'Stationery', item: 'Thank-You Cards & Postage', estimated: 0, actual: 0 },
  { category: 'Gifts', item: 'Wedding Favors/Gifts for Guests', estimated: 0, actual: 0 },
  { category: 'Gifts', item: 'Gifts for Bridal Party/Parents', estimated: 0, actual: 0 },
  { category: 'Events', item: 'Bachelorette/Bachelor Party Costs', estimated: 0, actual: 0 },
  { category: 'Events', item: 'Bridal Shower Costs', estimated: 0, actual: 0 },
  { category: 'Events', item: 'Rehearsal Dinner (Venue, Food, Decor, Invites)', estimated: 0, actual: 0 },
  { category: 'Events', item: 'Welcome Bags for Out-of-Town Guests', estimated: 0, actual: 0 },
  { category: 'Events', item: 'Second-Day/Post-Wedding Brunch Costs', estimated: 0, actual: 0 },
  { category: 'Travel', item: "Hotel Room Blocks (Couple's Suite, Guest Rooms)", estimated: 0, actual: 0 },
  { category: 'Travel', item: 'Travel Expenses (Flights, Gas, Lodging for Destination Weddings)', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Wedding Day Emergency Kit/Supplies', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Ring Bearer/Flower Girl Outfits & Gifts', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Pet Inclusion Costs (If applicable)', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Contingency Fund (Buffer for Unexpected Costs)', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Taxes & Service Charges (Often 15-25% on Venue/Catering)', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Credit Card Processing Fees (For Guest Payments)', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Tips/Gratuities (Vendors, Staff, Delivery)', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Post-Wedding Costs (Name Change Fees, Photo Albums, Video Editing Upgrades)', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Honeymoon Expenses (Flights, Lodging, Activities, Travel Insurance)', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Wedding Dress/Attire Rental (If applicable)', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Cultural/Religious Ceremony Add-ons (e.g., Unity Candle, Sand Ceremony, Ketubah)', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Permits (Park, Beach, Noise, Fire)', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Security Personnel (If required by venue)', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Childcare Services (During Reception)', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Accessibility Accommodations (ASL Interpreter, Ramp Rental, etc.)', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Waste Removal/Cleanup Fees', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Overtime Fees (Venue, Catering, Entertainment)', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Currency Exchange Fees (International Weddings)', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Data/Communication (International SIM, Roaming)', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Backup Equipment Rental (Tents, Heaters, Fans)', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Weather Insurance', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Cancellation/Postponement Insurance', estimated: 0, actual: 0 },
  { category: 'Misc', item: 'Digital Tools/App Subscriptions (Budgeting, Planning, Guest Management)', estimated: 0, actual: 0 },
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
    
    // Check if user has budget items
    const items = await db.collection('budget').find({ userId }).toArray();
    
    if (items.length === 0) {
      // Populate with default items
      const itemsToInsert = defaultItems.map(item => ({ ...item, userId }));
      await db.collection('budget').insertMany(itemsToInsert);
      const newItems = await db.collection('budget').find({ userId }).toArray();
      return NextResponse.json(newItems);
    }
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to fetch budget:', error);
    return NextResponse.json({ error: 'Failed to fetch budget' }, { status: 500 });
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
    const item = await request.json();
    
    const itemData = {
      ...item,
      userId: (session.user as any).id
    };
    
    const result = await db.collection('budget').insertOne(itemData);
    return NextResponse.json({ ...itemData, _id: result.insertedId.toString() });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add budget item' }, { status: 500 });
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
    const item = await request.json();
    
    const { _id, userId, ...dataToUpdate } = item;
    
    const result = await db.collection('budget').updateOne(
      { _id: new ObjectId(_id), userId: (session.user as any).id },
      { $set: dataToUpdate }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Item not found or unauthorized' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update budget item' }, { status: 500 });
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
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const result = await db.collection('budget').deleteOne({ 
      _id: new ObjectId(id),
      userId: (session.user as any).id 
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Item not found or unauthorized' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete budget item' }, { status: 500 });
  }
}
