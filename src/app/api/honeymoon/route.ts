import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { ObjectId } from 'mongodb';
import { defaultAirports, defaultAirlines } from './airports-seed';

// Default initial seeds
const defaultExpenses = [
  { category: 'Lodging', name: '5-Star Eco-conscious Ryokan Sowaka', estimated: 3500, actual: 0, contributor: '', contribution: 0 },
  { category: 'Flights', name: 'Delta Premium Select Roundtrip Tickets', estimated: 1800, actual: 0, contributor: '', contribution: 0 },
  { category: 'Dining', name: 'Romantic Candlelight Dinner (Kaiseki)', estimated: 350, actual: 0, contributor: '', contribution: 0 },
  { category: 'Activities', name: 'Private Garden Tea Ceremony & forest bathing', estimated: 300, actual: 0, contributor: '', contribution: 0 },
  { category: 'Excursions', name: 'Private Bamboo Forest Guided Tour', estimated: 250, actual: 0, contributor: '', contribution: 0 }
];

const defaultTasks = [
  { timeline: '6+ months out', text: 'Set budget & pick honeymoon budget tier', completed: false },
  { timeline: '6+ months out', text: 'Complete personality vibe quiz & pick destination', completed: false },
  { timeline: '6+ months out', text: 'Book flights and resort lodging packages', completed: false },
  { timeline: '3 months out', text: 'Secure passport validity & necessary visas', completed: false },
  { timeline: '3 months out', text: 'Purchase travel insurance plan', completed: false },
  { timeline: '2 months out', text: 'Book romantic dinners & specialty excursions', completed: false },
  { timeline: '2 months out', text: 'Arrange couples spa & relaxation treats', completed: false },
  { timeline: '1 month out', text: 'Finalize climate-based packing checklist', completed: false },
  { timeline: '1 month out', text: 'Photocopy/scan important docs to digital safe', completed: false },
  { timeline: '1 week out', text: 'Arrange pet care & house care', completed: false },
  { timeline: '1 week out', text: 'Download offline travel maps & local guides', completed: false },
  { timeline: '48 hours out', text: 'Reconfirm flights & set OOO work messages', completed: false },
  { timeline: '48 hours out', text: 'Arrive, unwind, and schedule pure rest for Day 1!', completed: true }
];

const defaultDocs = [
  { name: 'Passport Scans', type: 'Identification', dateAdded: '2026-05-19', secureUrl: '#' },
  { name: 'Travel Insurance Certificate', type: 'Insurance', dateAdded: '2026-05-19', secureUrl: '#' }
];

const defaultSettings = {
  partnerA: 'Alex',
  partnerB: 'Taylor',
  baseCurrency: 'USD',
  customCategories: ['Flights', 'Lodging', 'Dining', 'Activities', 'Excursions', 'Transit', 'Other'],
  startDate: '2026-09-15',
  endDate: '2026-09-22',
  destination: 'Kyoto Eco-Conscious Sanctuary'
};

const defaultDestinations = [
  { 
    name: 'Kyoto Eco-Conscious Sanctuary', 
    season: 'Spring/Summer', 
    visaRequired: 'No (90 days)', 
    flightHours: '12', 
    safetyNotes: 'No extreme weather warnings. Spring is peak cherry blossom season.', 
    score: 9, 
    notes: 'Stunning bamboo forests and culture, peaceful zen garden suites.', 
    status: 'selected',
    youtubeVideos: ['https://www.youtube.com/watch?v=hG5FhW-p4L8', 'https://www.youtube.com/watch?v=F38sRj8hRkI'],
    bestMonths: 'April to October',
    language: 'Japanese',
    localCurrency: 'JPY (¥)',
    plugType: 'Type A (Two-pin flat)',
    tippingNotes: 'Tipping is not customary in Japan; exceptional service is already standard.',
    safetyRank: 'Level 1 - Safe to travel'
  },
  { 
    name: 'Patagonia Glacier Domes', 
    season: 'Fall/Winter', 
    visaRequired: 'No (90 days)', 
    flightHours: '15', 
    safetyNotes: 'Seasonal high winds in active dome zones.', 
    score: 8, 
    notes: 'Incredible hiking trails but potentially freezing weather.', 
    status: 'researching',
    youtubeVideos: ['https://www.youtube.com/watch?v=F0pPh_aBifM'],
    bestMonths: 'November to March',
    language: 'Spanish',
    localCurrency: 'ARS ($)',
    plugType: 'Type C / I (Two-pin round / slanted)',
    tippingNotes: '10% is standard in restaurants and cafes.',
    safetyRank: 'Level 1 - Safe to travel'
  },
  { 
    name: 'Amalfi Coast Ravello Suite', 
    season: 'Spring/Summer', 
    visaRequired: 'No (Schengen)', 
    flightHours: '9', 
    safetyNotes: 'Peak Mediterranean summer humidity and high tourism.', 
    score: 9, 
    notes: 'Incredibly romantic cliffside gardens, but very expensive.', 
    status: 'researching',
    youtubeVideos: ['https://www.youtube.com/watch?v=GkXQ_s5BvV4'],
    bestMonths: 'May to September',
    language: 'Italian',
    localCurrency: 'EUR (€)',
    plugType: 'Type C / F / L (Two-pin / three-pin round)',
    tippingNotes: 'Tipping is not expected, but 5-10% is appreciated for outstanding service.',
    safetyRank: 'Level 1 - Safe to travel'
  }
];

const defaultExcursions = [
  {
    destinationName: 'Kyoto Eco-Conscious Sanctuary',
    title: 'Private Bamboo Forest Guided Tour',
    address: 'Arashiyama, Ukyo Ward, Kyoto, 616-8394, Japan',
    phoneNumber: '+81 75-861-0012',
    website: 'https://www.japan-guide.com/e/e3912.html',
    email: 'concierge@ryokansowaka.com',
    price: 250,
    notes: 'Meeting point at Arashiyama bridge with our private guide.',
    youtubeVideos: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
    images: ['https://images.unsplash.com/photo-1503899036084-c55cdd92da26'],
    otherInfo: 'Dress in layers. High photo potential!'
  },
  {
    destinationName: 'Kyoto Eco-Conscious Sanctuary',
    title: 'Private Tea Ceremony & Forest Bathing',
    address: 'Higashiyama Ward, Kyoto, 605-0822, Japan',
    phoneNumber: '+81 75-541-3320',
    website: 'https://www.sowaka.co.jp',
    email: 'tea@sowaka.co.jp',
    price: 300,
    notes: 'Traditional master-guided organic matcha preparation.',
    youtubeVideos: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'],
    otherInfo: 'Socks required. No heavy perfumes.'
  }
];

const defaultResearch = [
  // Flights
  { 
    category: 'flights', 
    optionNumber: 1, 
    title: 'Delta Premium Select Direct', 
    cost: 1800, 
    amenities: '1 check-in bag, free Wi-Fi, premium seat layout', 
    cancellationTerms: 'Free cancellation within 24h', 
    pros: 'Direct flight, great flight timing', 
    cons: 'Slightly more expensive', 
    status: 'comparing',
    airportWebsite: 'https://www.delta.com',
    phoneNumber: '1-800-221-1212',
    baggageAllowance: '2 carry-on, 1 checked up to 50lbs',
    terminalInfo: 'Terminal 4 LAX, Terminal 1 KIX',
    layoverDetails: 'Non-stop',
    bookingLink: 'https://www.delta.com/booking'
  },
  { 
    category: 'flights', 
    optionNumber: 2, 
    title: 'United Economy (1 Stop)', 
    cost: 1100, 
    amenities: 'Meals included, standard seat spacing', 
    cancellationTerms: 'Non-refundable, changes allowed for a fee', 
    pros: 'Cheapest budget option', 
    cons: '4-hour layover in LAX airport', 
    status: 'comparing',
    airportWebsite: 'https://www.united.com',
    phoneNumber: '1-800-864-8331',
    baggageAllowance: '1 carry-on, 1 checked (fee applies)',
    terminalInfo: 'Terminal 7 LAX, Terminal 2 KIX',
    layoverDetails: '4 hours in LAX',
    bookingLink: 'https://www.united.com/booking'
  },
  { 
    category: 'flights', 
    optionNumber: 3, 
    title: 'Japan Airlines Business Class', 
    cost: 4200, 
    amenities: 'Lie-flat beds, lounge access, custom fine dining', 
    cancellationTerms: 'Fully refundable', 
    pros: 'Absolute comfort, incredible luxury experience', 
    cons: 'Way over standard budget', 
    status: 'comparing',
    airportWebsite: 'https://www.jal.co.jp',
    phoneNumber: '1-800-525-3663',
    baggageAllowance: '2 carry-on, 2 checked up to 70lbs',
    terminalInfo: 'Terminal B LAX, Terminal 1 KIX',
    layoverDetails: 'Non-stop',
    bookingLink: 'https://www.jal.co.jp/booking'
  },
  // Lodging
  { 
    category: 'lodging', 
    optionNumber: 1, 
    title: 'Ryokan Sowaka (Traditional Luxury)', 
    cost: 3500, 
    amenities: 'Private zen garden, traditional kaiseki dining', 
    cancellationTerms: 'Free up to 7 days before', 
    pros: 'Extremely authentic and romantic atmosphere', 
    cons: 'Expensive, no swimming pool', 
    status: 'comparing',
    website: 'https://www.sowaka.co.jp',
    phoneNumber: '+81 75-541-3320',
    email: 'stay@sowaka.co.jp',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    roomType: 'Luxury Zen Suite with private cypress bath',
    breakfastIncluded: true,
    cancellationDeadline: '2026-09-08',
    depositStatus: '50% deposit paid ($1,750)',
    address: '480 Kiyomotocho, Higashiyama Ward, Kyoto, 605-0821, Japan'
  },
  { 
    category: 'lodging', 
    optionNumber: 2, 
    title: 'Hoshinoya Kyoto (Riverside Luxury)', 
    cost: 5200, 
    amenities: 'Boat access only, forest views, award-winning spa', 
    cancellationTerms: 'Free up to 14 days before', 
    pros: 'Pure luxury and quiet seclusion', 
    cons: 'Extremely expensive', 
    status: 'comparing',
    website: 'https://hoshinoya.com/kyoto/en/',
    phoneNumber: '+81 50-3786-1144',
    email: 'info_kyoto@hoshinoya.com',
    checkInTime: '15:00',
    checkOutTime: '12:00',
    roomType: 'Mizunoki Deluxe Room with River View',
    breakfastIncluded: false,
    cancellationDeadline: '2026-09-01',
    depositStatus: 'Fully prepaid on booking ($5,200)',
    address: '11-2 Arashiyama Genrokuzancho, Nishikyo Ward, Kyoto, 616-0007, Japan'
  },
  { 
    category: 'lodging', 
    optionNumber: 3, 
    title: 'Boutique Townhouse Machiya Rental', 
    cost: 1500, 
    amenities: 'Full kitchen, self check-in, local residential vibe', 
    cancellationTerms: 'Non-refundable', 
    pros: 'Great budget fit, lots of living space', 
    cons: 'No resort amenities or room service', 
    status: 'comparing',
    website: 'https://www.kyoto-machiya-inn.com',
    phoneNumber: '+81 75-343-0055',
    email: 'reservations@machiya-inn.com',
    checkInTime: '16:00',
    checkOutTime: '10:00',
    roomType: 'Two-bedroom Traditional Machiya House',
    breakfastIncluded: false,
    cancellationDeadline: 'Immediate non-refundable',
    depositStatus: 'Paid in full ($1,500)',
    address: 'Higashiyama Ward, Kyoto, 605-0017, Japan'
  },
  // Activities (legacy / standalone option compare)
  { category: 'activities', optionNumber: 1, title: 'Private Tea Ceremony & Forest Bathing', cost: 300, amenities: 'Private master tea guide, organic matcha', cancellationTerms: 'Free cancellation within 48h', pros: 'Highly intimate, serene cultural experience', cons: 'Requires early morning start', status: 'comparing' },
  { category: 'activities', optionNumber: 2, title: 'Guided Food Tour through Gion', cost: 180, amenities: '8 culinary tastings, local food guide', cancellationTerms: 'Free cancellation within 24h', pros: 'Taste hidden local gems, sake pairing', cons: 'A lot of walking involved', status: 'comparing' }
];

const defaultItinerary = [
  { dayNumber: 1, timeOfDay: 'Morning', activityType: 'transit', title: 'Depart Home Airport', cost: 0, notes: 'Double check passport scans are saved to phone offline safe.', reservationCode: 'DL-4829', excitementRating: 5 },
  { dayNumber: 1, timeOfDay: 'Evening', activityType: 'lodging', title: 'Ryokan Sowaka Check-in & Rest', cost: 0, notes: 'Welcome sake and hot bath scheduled on arrival.', reservationCode: 'SO-9201', excitementRating: 5 },
  { dayNumber: 2, timeOfDay: 'Morning', activityType: 'rest', title: 'Radical Rest & Sleep-In', cost: 0, notes: 'Sleep in until late morning to beat any jet lag.', reservationCode: '', excitementRating: 4 },
  { dayNumber: 2, timeOfDay: 'Afternoon', activityType: 'excursion', title: 'Private Bamboo Forest Guided Tour', cost: 250, notes: 'Meeting point at Arashiyama bridge with our private guide.', reservationCode: 'FB-9821', excitementRating: 5 },
  { dayNumber: 2, timeOfDay: 'Evening', activityType: 'dining', title: 'Kaiseki Dinner Masterclass', cost: 350, notes: 'Traditional multi-course seasonal culinary experience.', reservationCode: 'DIN-4819', excitementRating: 5 }
];

const defaultPacking = [
  // Partner A
  { traveler: 'partnerA', category: 'clothing', itemName: 'Linen button-down shirts (x4)', packed: false },
  { traveler: 'partnerA', category: 'clothing', itemName: 'Comfortable walking sneakers', packed: true },
  { traveler: 'partnerA', category: 'clothing', itemName: 'Smart dinner attire & shoes', packed: false },
  { traveler: 'partnerA', category: 'toiletries', itemName: 'Travel toothbrush & toothpaste', packed: true },
  { traveler: 'partnerA', category: 'electronics', itemName: 'Universal power plug adapter', packed: false },
  { traveler: 'partnerA', category: 'documents', itemName: 'Physical passport book', packed: true },
  { traveler: 'partnerA', category: 'romantic', itemName: 'Surprise hand-written card', packed: false },

  // Partner B
  { traveler: 'partnerB', category: 'clothing', itemName: 'Flowy sundresses (x3)', packed: false },
  { traveler: 'partnerB', category: 'clothing', itemName: 'Comfortable walking sandals', packed: true },
  { traveler: 'partnerB', category: 'clothing', itemName: 'Swimsuits & sun hats', packed: false },
  { traveler: 'partnerB', category: 'toiletries', itemName: 'Skincare routine travel bottles', packed: true },
  { traveler: 'partnerB', category: 'electronics', itemName: 'Noise-cancelling headphones', packed: false },
  { traveler: 'partnerB', category: 'documents', itemName: 'Printed flight vouchers', packed: false },
  { traveler: 'partnerB', category: 'romantic', itemName: 'Travel polaroid camera & film', packed: true }
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

    if (type === 'expenses') {
      const expenses = await db.collection('honeymoon_expenses').find({ userId }).toArray();
      if (expenses.length === 0) {
        await db.collection('honeymoon_expenses').insertMany(defaultExpenses.map(e => ({ ...e, userId })));
        return NextResponse.json(await db.collection('honeymoon_expenses').find({ userId }).toArray());
      }
      return NextResponse.json(expenses);
    }

    if (type === 'tasks') {
      const tasks = await db.collection('honeymoon_tasks').find({ userId }).toArray();
      if (tasks.length === 0) {
        await db.collection('honeymoon_tasks').insertMany(defaultTasks.map(t => ({ ...t, userId })));
        return NextResponse.json(await db.collection('honeymoon_tasks').find({ userId }).toArray());
      }
      return NextResponse.json(tasks);
    }

    if (type === 'docs') {
      const docs = await db.collection('honeymoon_docs').find({ userId }).toArray();
      if (docs.length === 0) {
        await db.collection('honeymoon_docs').insertMany(defaultDocs.map(d => ({ ...d, userId })));
        return NextResponse.json(await db.collection('honeymoon_docs').find({ userId }).toArray());
      }
      return NextResponse.json(docs);
    }

    if (type === 'settings') {
      let settings = await db.collection('honeymoon_settings').findOne({ userId });
      if (!settings) {
        await db.collection('honeymoon_settings').insertOne({ ...defaultSettings, userId });
        settings = await db.collection('honeymoon_settings').findOne({ userId });
      }
      return NextResponse.json(settings);
    }

    if (type === 'destinations') {
      const destinations = await db.collection('honeymoon_destinations').find({ userId }).toArray();
      if (destinations.length === 0) {
        await db.collection('honeymoon_destinations').insertMany(defaultDestinations.map(d => ({ ...d, userId })));
        return NextResponse.json(await db.collection('honeymoon_destinations').find({ userId }).toArray());
      }
      return NextResponse.json(destinations);
    }

    if (type === 'excursions') {
      const excursions = await db.collection('honeymoon_excursions').find({ userId }).toArray();
      if (excursions.length === 0) {
        await db.collection('honeymoon_excursions').insertMany(defaultExcursions.map(e => ({ ...e, userId })));
        return NextResponse.json(await db.collection('honeymoon_excursions').find({ userId }).toArray());
      }
      return NextResponse.json(excursions);
    }

    if (type === 'research') {
      const research = await db.collection('honeymoon_research').find({ userId }).toArray();
      if (research.length === 0) {
        await db.collection('honeymoon_research').insertMany(defaultResearch.map(r => ({ ...r, userId })));
        return NextResponse.json(await db.collection('honeymoon_research').find({ userId }).toArray());
      }
      return NextResponse.json(research);
    }

    if (type === 'itinerary') {
      const itinerary = await db.collection('honeymoon_itinerary').find({ userId }).toArray();
      if (itinerary.length === 0) {
        await db.collection('honeymoon_itinerary').insertMany(defaultItinerary.map(i => ({ ...i, userId })));
        return NextResponse.json(await db.collection('honeymoon_itinerary').find({ userId }).toArray());
      }
      return NextResponse.json(itinerary);
    }

    if (type === 'packing') {
      const packing = await db.collection('honeymoon_packing').find({ userId }).toArray();
      if (packing.length === 0) {
        await db.collection('honeymoon_packing').insertMany(defaultPacking.map(p => ({ ...p, userId })));
        return NextResponse.json(await db.collection('honeymoon_packing').find({ userId }).toArray());
      }
      return NextResponse.json(packing);
    }

    if (type === 'quiz') {
      const quiz = await db.collection('honeymoon_quiz').findOne({ userId });
      return NextResponse.json(quiz || { vibe: 'Relaxation', budget: 'Comfort', season: 'Spring/Summer' });
    }

    if (type === 'airports') {
      const airports = await db.collection('honeymoon_airports').find({ userId }).toArray();
      if (airports.length === 0) {
        await db.collection('honeymoon_airports').insertMany(defaultAirports.map(a => ({ ...a, userId })));
        return NextResponse.json(await db.collection('honeymoon_airports').find({ userId }).toArray());
      }
      return NextResponse.json(airports);
    }

    if (type === 'airlines') {
      const airlines = await db.collection('honeymoon_airlines').find({ userId }).toArray();
      if (airlines.length === 0) {
        await db.collection('honeymoon_airlines').insertMany(defaultAirlines.map(a => ({ ...a, userId })));
        return NextResponse.json(await db.collection('honeymoon_airlines').find({ userId }).toArray());
      }
      return NextResponse.json(airlines);
    }

    // Default fetch all aggregated for optimal one-shot page mounting
    const [expenses, tasks, docs, quiz, settings, destinations, research, itinerary, packing, excursions, airports, airlines] = await Promise.all([
      db.collection('honeymoon_expenses').find({ userId }).toArray(),
      db.collection('honeymoon_tasks').find({ userId }).toArray(),
      db.collection('honeymoon_docs').find({ userId }).toArray(),
      db.collection('honeymoon_quiz').findOne({ userId }),
      db.collection('honeymoon_settings').findOne({ userId }),
      db.collection('honeymoon_destinations').find({ userId }).toArray(),
      db.collection('honeymoon_research').find({ userId }).toArray(),
      db.collection('honeymoon_itinerary').find({ userId }).toArray(),
      db.collection('honeymoon_packing').find({ userId }).toArray(),
      db.collection('honeymoon_excursions').find({ userId }).toArray(),
      db.collection('honeymoon_airports').find({ userId }).toArray(),
      db.collection('honeymoon_airlines').find({ userId }).toArray(),
    ]);

    // Seed defaults if empty inside aggregation
    let finalExpenses = expenses;
    if (expenses.length === 0) {
      await db.collection('honeymoon_expenses').insertMany(defaultExpenses.map(e => ({ ...e, userId })));
      finalExpenses = await db.collection('honeymoon_expenses').find({ userId }).toArray();
    }

    let finalTasks = tasks;
    if (tasks.length === 0) {
      await db.collection('honeymoon_tasks').insertMany(defaultTasks.map(t => ({ ...t, userId })));
      finalTasks = await db.collection('honeymoon_tasks').find({ userId }).toArray();
    }

    let finalDocs = docs;
    if (docs.length === 0) {
      await db.collection('honeymoon_docs').insertMany(defaultDocs.map(d => ({ ...d, userId })));
      finalDocs = await db.collection('honeymoon_docs').find({ userId }).toArray();
    }

    let finalSettings = settings;
    if (!settings) {
      await db.collection('honeymoon_settings').insertOne({ ...defaultSettings, userId });
      finalSettings = await db.collection('honeymoon_settings').findOne({ userId });
    }

    let finalDestinations = destinations;
    if (destinations.length === 0) {
      await db.collection('honeymoon_destinations').insertMany(defaultDestinations.map(d => ({ ...d, userId })));
      finalDestinations = await db.collection('honeymoon_destinations').find({ userId }).toArray();
    }

    let finalExcursions = excursions;
    if (excursions.length === 0) {
      await db.collection('honeymoon_excursions').insertMany(defaultExcursions.map(e => ({ ...e, userId })));
      finalExcursions = await db.collection('honeymoon_excursions').find({ userId }).toArray();
    }

    let finalResearch = research;
    if (research.length === 0) {
      await db.collection('honeymoon_research').insertMany(defaultResearch.map(r => ({ ...r, userId })));
      finalResearch = await db.collection('honeymoon_research').find({ userId }).toArray();
    }

    let finalItinerary = itinerary;
    if (itinerary.length === 0) {
      await db.collection('honeymoon_itinerary').insertMany(defaultItinerary.map(i => ({ ...i, userId })));
      finalItinerary = await db.collection('honeymoon_itinerary').find({ userId }).toArray();
    }

    let finalPacking = packing;
    if (packing.length === 0) {
      await db.collection('honeymoon_packing').insertMany(defaultPacking.map(p => ({ ...p, userId })));
      finalPacking = await db.collection('honeymoon_packing').find({ userId }).toArray();
    }

    // Seed airports/airlines if empty
    let finalAirports = airports;
    if (airports.length === 0) {
      await db.collection('honeymoon_airports').insertMany(defaultAirports.map(a => ({ ...a, userId })));
      finalAirports = await db.collection('honeymoon_airports').find({ userId }).toArray();
    }
    let finalAirlines = airlines;
    if (airlines.length === 0) {
      await db.collection('honeymoon_airlines').insertMany(defaultAirlines.map(a => ({ ...a, userId })));
      finalAirlines = await db.collection('honeymoon_airlines').find({ userId }).toArray();
    }

    return NextResponse.json({
      expenses: finalExpenses,
      tasks: finalTasks,
      docs: finalDocs,
      quiz: quiz || { vibe: 'Relaxation', budget: 'Comfort', season: 'Spring/Summer' },
      settings: finalSettings,
      destinations: finalDestinations,
      research: finalResearch,
      itinerary: finalItinerary,
      packing: finalPacking,
      excursions: finalExcursions,
      airports: finalAirports,
      airlines: finalAirlines
    });

  } catch (error) {
    console.error('Honeymoon API GET Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve honeymoon items' }, { status: 500 });
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

    if (type === 'quiz') {
      await db.collection('honeymoon_quiz').updateOne(
        { userId },
        { $set: { userId, vibe: body.vibe, budget: body.budget, season: body.season } },
        { upsert: true }
      );
      return NextResponse.json({ success: true });
    }

    if (type === 'settings') {
      await db.collection('honeymoon_settings').updateOne(
        { userId },
        { $set: { 
          userId, 
          partnerA: body.partnerA || 'Alex', 
          partnerB: body.partnerB || 'Taylor', 
          baseCurrency: body.baseCurrency || 'USD', 
          customCategories: body.customCategories || [], 
          startDate: body.startDate || '', 
          endDate: body.endDate || '', 
          destination: body.destination || '' 
        } },
        { upsert: true }
      );
      const settings = await db.collection('honeymoon_settings').findOne({ userId });
      return NextResponse.json(settings);
    }

    if (type === 'expenses') {
      const expenseData = {
        userId,
        category: body.category || 'General',
        name: body.name || 'Custom Item',
        estimated: Number(body.estimated || 0),
        actual: Number(body.actual || 0),
        contributor: body.contributor || '',
        contribution: Number(body.contribution || 0)
      };
      const result = await db.collection('honeymoon_expenses').insertOne(expenseData);
      return NextResponse.json({ ...expenseData, _id: result.insertedId.toString() });
    }

    if (type === 'tasks') {
      const taskData = {
        userId,
        timeline: body.timeline || '6+ months out',
        text: body.text || 'New task',
        completed: false
      };
      const result = await db.collection('honeymoon_tasks').insertOne(taskData);
      return NextResponse.json({ ...taskData, _id: result.insertedId.toString() });
    }

    if (type === 'docs') {
      const docData = {
        userId,
        name: body.name || 'New Document',
        type: body.type || 'Other',
        dateAdded: new Date().toISOString().split('T')[0],
        secureUrl: body.secureUrl || '#'
      };
      const result = await db.collection('honeymoon_docs').insertOne(docData);
      return NextResponse.json({ ...docData, _id: result.insertedId.toString() });
    }

    if (type === 'destinations') {
      const destData = {
        userId,
        name: body.name || 'New Destination',
        season: body.season || 'Spring/Summer',
        visaRequired: body.visaRequired || 'No',
        flightHours: body.flightHours || '5',
        safetyNotes: body.safetyNotes || 'None',
        score: Number(body.score || 5),
        notes: body.notes || '',
        status: body.status || 'researching',
        youtubeVideos: body.youtubeVideos || [],
        bestMonths: body.bestMonths || '',
        language: body.language || '',
        localCurrency: body.localCurrency || '',
        plugType: body.plugType || '',
        tippingNotes: body.tippingNotes || '',
        safetyRank: body.safetyRank || ''
      };
      const result = await db.collection('honeymoon_destinations').insertOne(destData);
      return NextResponse.json({ ...destData, _id: result.insertedId.toString() });
    }

    if (type === 'excursions') {
      const excursionData = {
        userId,
        destinationName: body.destinationName || '',
        title: body.title || 'New Excursion',
        address: body.address || '',
        phoneNumber: body.phoneNumber || '',
        website: body.website || '',
        email: body.email || '',
        price: Number(body.price || 0),
        notes: body.notes || '',
        youtubeVideos: body.youtubeVideos || [],
        images: body.images || [],
        otherInfo: body.otherInfo || ''
      };
      const result = await db.collection('honeymoon_excursions').insertOne(excursionData);
      return NextResponse.json({ ...excursionData, _id: result.insertedId.toString() });
    }

    if (type === 'research') {
      const researchData = {
        userId,
        category: body.category || 'flights',
        optionNumber: Number(body.optionNumber || 1),
        title: body.title || 'New Comparison Option',
        cost: Number(body.cost || 0),
        amenities: body.amenities || '',
        cancellationTerms: body.cancellationTerms || '',
        pros: body.pros || '',
        cons: body.cons || '',
        status: body.status || 'comparing',
        // flights specific
        airportWebsite: body.airportWebsite || '',
        phoneNumber: body.phoneNumber || '',
        baggageAllowance: body.baggageAllowance || '',
        terminalInfo: body.terminalInfo || '',
        layoverDetails: body.layoverDetails || '',
        bookingLink: body.bookingLink || '',
        // lodging specific
        website: body.website || '',
        email: body.email || '',
        checkInTime: body.checkInTime || '',
        checkOutTime: body.checkOutTime || '',
        roomType: body.roomType || '',
        breakfastIncluded: body.breakfastIncluded || false,
        cancellationDeadline: body.cancellationDeadline || '',
        depositStatus: body.depositStatus || '',
        address: body.address || ''
      };
      const result = await db.collection('honeymoon_research').insertOne(researchData);
      return NextResponse.json({ ...researchData, _id: result.insertedId.toString() });
    }

    if (type === 'itinerary') {
      const itineraryData = {
        userId,
        dayNumber: Number(body.dayNumber || 1),
        timeOfDay: body.timeOfDay || 'Morning',
        activityType: body.activityType || 'excursion',
        title: body.title || 'New Activity',
        cost: Number(body.cost || 0),
        notes: body.notes || '',
        reservationCode: body.reservationCode || '',
        excitementRating: Number(body.excitementRating || 5)
      };
      const result = await db.collection('honeymoon_itinerary').insertOne(itineraryData);
      return NextResponse.json({ ...itineraryData, _id: result.insertedId.toString() });
    }

    if (type === 'packing') {
      const packingData = {
        userId,
        traveler: body.traveler || 'partnerA',
        category: body.category || 'clothing',
        itemName: body.itemName || 'New Item',
        packed: false
      };
      const result = await db.collection('honeymoon_packing').insertOne(packingData);
      return NextResponse.json({ ...packingData, _id: result.insertedId.toString() });
    }

    if (type === 'airports') {
      const airportData = { userId, state: body.state || '', city: body.city || '', name: body.name || 'New Airport', code: body.code || '', website: body.website || '', phone: body.phone || '', notes: body.notes || '' };
      const result = await db.collection('honeymoon_airports').insertOne(airportData);
      return NextResponse.json({ ...airportData, _id: result.insertedId.toString() });
    }

    if (type === 'airlines') {
      const airlineData = { userId, name: body.name || 'New Airline', headquarters: body.headquarters || '', website: body.website || '', phone: body.phone || '', notes: body.notes || '' };
      const result = await db.collection('honeymoon_airlines').insertOne(airlineData);
      return NextResponse.json({ ...airlineData, _id: result.insertedId.toString() });
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('Honeymoon API POST Error:', error);
    return NextResponse.json({ error: 'Failed to create honeymoon item' }, { status: 500 });
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

    // Settings uses userId and does not require an _id field in PUT
    if (type === 'settings') {
      await db.collection('honeymoon_settings').updateOne(
        { userId },
        { $set: dataToUpdate }
      );
      return NextResponse.json({ success: true });
    }

    if (!_id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const collectionName = 
      type === 'expenses' ? 'honeymoon_expenses' : 
      type === 'tasks' ? 'honeymoon_tasks' : 
      type === 'docs' ? 'honeymoon_docs' : 
      type === 'destinations' ? 'honeymoon_destinations' :
      type === 'excursions' ? 'honeymoon_excursions' :
      type === 'research' ? 'honeymoon_research' :
      type === 'itinerary' ? 'honeymoon_itinerary' :
      type === 'packing' ? 'honeymoon_packing' :
      type === 'airports' ? 'honeymoon_airports' :
      type === 'airlines' ? 'honeymoon_airlines' : null;

    if (!collectionName) {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    // Dynamic numeric casting for validation
    if (type === 'expenses') {
      if (dataToUpdate.estimated !== undefined) dataToUpdate.estimated = Number(dataToUpdate.estimated);
      if (dataToUpdate.actual !== undefined) dataToUpdate.actual = Number(dataToUpdate.actual);
      if (dataToUpdate.contribution !== undefined) dataToUpdate.contribution = Number(dataToUpdate.contribution);
    } else if (type === 'destinations') {
      if (dataToUpdate.score !== undefined) dataToUpdate.score = Number(dataToUpdate.score);
    } else if (type === 'excursions') {
      if (dataToUpdate.price !== undefined) dataToUpdate.price = Number(dataToUpdate.price);
    } else if (type === 'research') {
      if (dataToUpdate.cost !== undefined) dataToUpdate.cost = Number(dataToUpdate.cost);
      if (dataToUpdate.optionNumber !== undefined) dataToUpdate.optionNumber = Number(dataToUpdate.optionNumber);
    } else if (type === 'itinerary') {
      if (dataToUpdate.dayNumber !== undefined) dataToUpdate.dayNumber = Number(dataToUpdate.dayNumber);
      if (dataToUpdate.cost !== undefined) dataToUpdate.cost = Number(dataToUpdate.cost);
      if (dataToUpdate.excitementRating !== undefined) dataToUpdate.excitementRating = Number(dataToUpdate.excitementRating);
    }

    const result = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(_id), userId },
      { $set: dataToUpdate }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Item not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Honeymoon API PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update honeymoon item' }, { status: 500 });
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
      type === 'expenses' ? 'honeymoon_expenses' : 
      type === 'tasks' ? 'honeymoon_tasks' : 
      type === 'docs' ? 'honeymoon_docs' : 
      type === 'destinations' ? 'honeymoon_destinations' :
      type === 'excursions' ? 'honeymoon_excursions' :
      type === 'research' ? 'honeymoon_research' :
      type === 'itinerary' ? 'honeymoon_itinerary' :
      type === 'packing' ? 'honeymoon_packing' :
      type === 'airports' ? 'honeymoon_airports' :
      type === 'airlines' ? 'honeymoon_airlines' : null;

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
    console.error('Honeymoon API DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete honeymoon item' }, { status: 500 });
  }
}
