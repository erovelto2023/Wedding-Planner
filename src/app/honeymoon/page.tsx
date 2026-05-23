'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { validatePassportExpiry, checkWeatherWarnings } from '@/lib/honeymoonUtils';

interface Expense {
  _id?: string;
  category: string;
  name: string;
  estimated: number;
  actual: number;
  contributor: string;
  contribution: number;
}

interface Task {
  _id?: string;
  timeline: string;
  text: string;
  completed: boolean;
}

interface DocScan {
  _id?: string;
  name: string;
  type: string;
  dateAdded: string;
  secureUrl: string;
}

interface Settings {
  partnerA: string;
  partnerB: string;
  baseCurrency: string;
  customCategories: string[];
  startDate: string;
  endDate: string;
  destination: string;
}

interface DestinationIdea {
  _id?: string;
  name: string;
  season: string;
  visaRequired: string;
  flightHours: string;
  safetyNotes: string;
  score: number;
  notes: string;
  status: 'researching' | 'selected';
  youtubeVideos?: string[];
  bestMonths?: string;
  language?: string;
  localCurrency?: string;
  plugType?: string;
  tippingNotes?: string;
  safetyRank?: string;
}

interface Excursion {
  _id?: string;
  destinationName: string;
  title: string;
  address: string;
  phoneNumber: string;
  website: string;
  email: string;
  price: number;
  notes: string;
  youtubeVideos: string[];
  images: string[];
  otherInfo: string;
}

interface ResearchItem {
  _id?: string;
  category: 'flights' | 'lodging' | 'activities';
  optionNumber: number;
  title: string;
  cost: number;
  amenities: string;
  cancellationTerms: string;
  pros: string;
  cons: string;
  status: 'comparing' | 'reserved';
  airportWebsite?: string;
  phoneNumber?: string;
  baggageAllowance?: string;
  terminalInfo?: string;
  layoverDetails?: string;
  bookingLink?: string;
  website?: string;
  email?: string;
  checkInTime?: string;
  checkOutTime?: string;
  roomType?: string;
  breakfastIncluded?: boolean;
  cancellationDeadline?: string;
  depositStatus?: string;
  address?: string;
}

interface ItineraryItem {
  _id?: string;
  dayNumber: number;
  timeOfDay: string;
  activityType: 'transit' | 'lodging' | 'dining' | 'excursion' | 'rest' | 'sights';
  title: string;
  cost: number;
  notes: string;
  reservationCode: string;
  excitementRating: number;
}

interface PackingItem {
  _id?: string;
  traveler: 'partnerA' | 'partnerB';
  category: 'clothing' | 'toiletries' | 'electronics' | 'documents' | 'essentials' | 'romantic';
  itemName: string;
  packed: boolean;
}

interface Airport {
  _id?: string;
  state: string;
  city: string;
  name: string;
  code: string;
  website: string;
  phone: string;
  notes: string;
}

interface Airline {
  _id?: string;
  name: string;
  headquarters: string;
  website: string;
  phone: string;
  notes: string;
}

export default function HoneymoonPage() {
  const [activeTab, setActiveTab] = useState<string>('start');
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  // Core Aggregated State
  const [settings, setSettings] = useState<Settings>({
    partnerA: 'Alex',
    partnerB: 'Taylor',
    baseCurrency: 'USD',
    customCategories: ['Flights', 'Lodging', 'Dining', 'Activities', 'Excursions', 'Transit', 'Other'],
    startDate: '2026-09-15',
    endDate: '2026-09-22',
    destination: 'Kyoto Eco-Conscious Sanctuary'
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [docs, setDocs] = useState<DocScan[]>([]);
  const [destinations, setDestinations] = useState<DestinationIdea[]>([]);
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [research, setResearch] = useState<ResearchItem[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [packing, setPacking] = useState<PackingItem[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [airlines, setAirlines] = useState<Airline[]>([]);

  // Input states
  const [numDays, setNumDays] = useState<number>(7);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [passportExpiry, setPassportExpiry] = useState<string>('2027-06-30');
  const [activeResearchSubtab, setActiveResearchSubtab] = useState<'flights' | 'lodging' | 'activities'>('flights');
  
  // Custom new item additions states
  const [newDestName, setNewDestName] = useState<string>('');
  const [newExpenseItem, setNewExpenseItem] = useState<Partial<Expense>>({ category: 'Lodging', name: '', estimated: 0, actual: 0 });
  const [newItineraryItem, setNewItineraryItem] = useState<Partial<ItineraryItem>>({ dayNumber: 1, timeOfDay: 'Morning', activityType: 'excursion', title: '', cost: 0, notes: '', reservationCode: '', excitementRating: 5 });
  const [newPackingItem, setNewPackingItem] = useState<Partial<PackingItem>>({ traveler: 'partnerA', category: 'clothing', itemName: '' });
  const [newTaskText, setNewTaskText] = useState<string>('');
  const [newTaskTimeline, setNewTaskTimeline] = useState<string>('6+ months out');
  const [newDocName, setNewDocName] = useState<string>('');
  const [newDocType, setNewDocType] = useState<string>('Identification');

  // Relational Excursion Input State
  const [excursionFormForDest, setExcursionFormForDest] = useState<string | null>(null);
  const [newExcursion, setNewExcursion] = useState<Partial<Excursion>>({
    title: '',
    address: '',
    phoneNumber: '',
    website: '',
    email: '',
    price: 0,
    notes: '',
    youtubeVideos: [],
    images: [],
    otherInfo: ''
  });

  // URL parsing helpers for inputs
  const [tempDestVideoUrl, setTempDestVideoUrl] = useState<{ [destId: string]: string }>({});
  const [tempExcVideoUrl, setTempExcVideoUrl] = useState<string>('');

  // Currency converter widget states
  const [convertAmount, setConvertAmount] = useState<number>(100);
  const [convertFrom, setConvertFrom] = useState<string>('EUR');
  const [exchangeRate, setExchangeRate] = useState<number>(1.09);

  // Countdown timer calculations
  const [daysRemaining, setDaysRemaining] = useState<number>(118);

  // Airport / Airline reference DB states
  const [airportSearch, setAirportSearch] = useState<string>('');
  const [airportStateFilter, setAirportStateFilter] = useState<string>('All');
  const [showAirportDB, setShowAirportDB] = useState<boolean>(false);
  const [showAirlineDB, setShowAirlineDB] = useState<boolean>(false);
  const [editingAirport, setEditingAirport] = useState<string | null>(null);
  const [editingAirline, setEditingAirline] = useState<string | null>(null);
  const [newAirport, setNewAirport] = useState<Partial<Airport>>({ state: '', city: '', name: '', code: '', website: '', phone: '', notes: '' });
  const [newAirline, setNewAirline] = useState<Partial<Airline>>({ name: '', headquarters: '', website: '', phone: '', notes: '' });
  const [showAddAirport, setShowAddAirport] = useState<boolean>(false);
  const [showAddAirline, setShowAddAirline] = useState<boolean>(false);

  // Print states
  const [showPrintMenu, setShowPrintMenu] = useState<boolean>(false);

  const handlePrint = (section: string) => {
    const prevTab = activeTab;
    if (section !== 'current' && section !== 'all') {
      setActiveTab(section);
    }
    setShowPrintMenu(false);
    setTimeout(() => {
      document.title = `Honeymoon Planner — ${settings.partnerA} & ${settings.partnerB}`;
      window.print();
      if (section !== 'current' && section !== 'all') {
        setActiveTab(prevTab);
      }
    }, 300);
  };

  // Real-time climate/safety alert notifications
  const safetyAlerts: Array<{ type: 'error' | 'warning'; message: string }> = [];

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      try {
        const res = await fetch('/api/honeymoon');
        if (res.ok) {
          const data = await res.json();
          setExpenses(data.expenses || []);
          setTasks(data.tasks || []);
          setDocs(data.docs || []);
          if (data.settings) setSettings(data.settings);
          setDestinations(data.destinations || []);
          setExcursions(data.excursions || []);
          setResearch(data.research || []);
          setItinerary(data.itinerary || []);
          setPacking(data.packing || []);
          setAirports(data.airports || []);
          setAirlines(data.airlines || []);
        }
      } catch (error) {
        console.error('Failed to load honeymoon data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Update departure timer dynamically based on settings
  useEffect(() => {
    if (!settings.startDate) return;
    const tripStart = new Date(settings.startDate).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((tripStart - now) / (1000 * 60 * 60 * 24));
    setDaysRemaining(diff > 0 ? diff : 0);
  }, [settings.startDate]);

  // Sync trip duration in days dynamically from settings
  useEffect(() => {
    if (settings.startDate && settings.endDate) {
      const start = new Date(settings.startDate).getTime();
      const end = new Date(settings.endDate).getTime();
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        setNumDays(diffDays);
      }
    }
  }, [settings.startDate, settings.endDate]);

  // Auditor alert checks
  if (mounted) {
    const weather = checkWeatherWarnings(settings.destination, settings.startDate);
    if (weather.warning) {
      safetyAlerts.push({ type: 'warning', message: weather.message });
    }
    const isPassportSafe = validatePassportExpiry(passportExpiry, settings.startDate);
    if (!isPassportSafe) {
      safetyAlerts.push({ type: 'error', message: '⚠️ Passport Expiry Danger: Your passport expires within 6 months of your return. Renew immediately!' });
    }
  }

  const maxItineraryDay = itinerary.reduce((max, item) => Math.max(max, item.dayNumber || 1), 1);
  const displayDays = Math.max(numDays, maxItineraryDay);

  // --- HANDLERS ---

  // Settings
  const handleUpdateSettings = async (updated: Partial<Settings>) => {
    const newSettings = { ...settings, ...updated };
    setSettings(newSettings);
    try {
      await fetch('/api/honeymoon?type=settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
    } catch (e) {
      console.error('Settings save failed:', e);
    }
  };

  // Add customized category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim() || settings.customCategories.includes(newCategoryName)) return;
    const updatedCategories = [...settings.customCategories, newCategoryName.trim()];
    setNewCategoryName('');
    await handleUpdateSettings({ customCategories: updatedCategories });
  };

  // Remove customized category
  const handleRemoveCategory = async (cat: string) => {
    const updatedCategories = settings.customCategories.filter(c => c !== cat);
    await handleUpdateSettings({ customCategories: updatedCategories });
  };

  // Destinations Idea CRUD
  const handleAddDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDestName.trim()) return;
    const itemData = {
      name: newDestName.trim(),
      season: 'Spring/Summer',
      visaRequired: 'No',
      flightHours: '6',
      safetyNotes: 'None',
      score: 8,
      notes: '',
      status: 'researching',
      youtubeVideos: [],
      bestMonths: '',
      language: '',
      localCurrency: '',
      plugType: '',
      tippingNotes: '',
      safetyRank: 'Level 1'
    };
    try {
      const res = await fetch('/api/honeymoon?type=destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      if (res.ok) {
        const added = await res.json();
        setDestinations([...destinations, added]);
        setNewDestName('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateDestination = async (item: DestinationIdea, field: keyof DestinationIdea, value: any) => {
    const updatedItem = { ...item, [field]: value };
    try {
      const res = await fetch('/api/honeymoon?type=destinations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });
      if (res.ok) {
        setDestinations(destinations.map(d => d._id === item._id ? updatedItem : d));
        // If locked in, update globally
        if (field === 'status' && value === 'selected') {
          await handleUpdateSettings({ destination: item.name });
          // Mark all others as researching
          destinations.forEach(async (d) => {
            if (d._id !== item._id && d.status === 'selected') {
              await fetch('/api/honeymoon?type=destinations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...d, status: 'researching' })
              });
            }
          });
          setDestinations(destinations.map(d => d._id === item._id ? { ...updatedItem, status: 'selected' } : { ...d, status: 'researching' }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDestination = async (id: string) => {
    try {
      const res = await fetch(`/api/honeymoon?type=destinations&id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setDestinations(destinations.filter(d => d._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Excursion CRUD Handlers
  const handleAddExcursionSubmit = async (e: React.FormEvent, destName: string) => {
    e.preventDefault();
    if (!newExcursion.title?.trim()) return;
    const bodyData = {
      ...newExcursion,
      destinationName: destName
    };
    try {
      const res = await fetch('/api/honeymoon?type=excursions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      if (res.ok) {
        const added = await res.json();
        setExcursions([...excursions, added]);
        setNewExcursion({
          title: '',
          address: '',
          phoneNumber: '',
          website: '',
          email: '',
          price: 0,
          notes: '',
          youtubeVideos: [],
          images: [],
          otherInfo: ''
        });
        setExcursionFormForDest(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateExcursion = async (item: Excursion, field: keyof Excursion, value: any) => {
    const updated = { ...item, [field]: value };
    try {
      const res = await fetch('/api/honeymoon?type=excursions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setExcursions(excursions.map(e => e._id === item._id ? updated : e));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExcursion = async (id: string) => {
    try {
      const res = await fetch(`/api/honeymoon?type=excursions&id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setExcursions(excursions.filter(e => e._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePushExcursionToBudget = async (exc: Excursion) => {
    const newExp = {
      category: 'Excursions',
      name: `Excursion: ${exc.title} (${exc.destinationName})`,
      estimated: exc.price,
      actual: 0,
      contributor: '',
      contribution: 0
    };
    try {
      const res = await fetch('/api/honeymoon?type=expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExp)
      });
      if (res.ok) {
        const added = await res.json();
        setExpenses(prev => [...prev, added]);
        alert(`💰 Successful relational copy! Added "${exc.title}" as an excursion expense line in your Budget sheets.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePushExcursionToItinerary = async (exc: Excursion, dayNum: number) => {
    const newItin = {
      dayNumber: dayNum,
      timeOfDay: 'Afternoon',
      activityType: 'excursion' as any,
      title: exc.title,
      cost: exc.price,
      notes: `Excursion. Address: ${exc.address || 'N/A'}. Phone: ${exc.phoneNumber || 'N/A'}. Info: ${exc.notes}`,
      reservationCode: 'RELATIONAL-EXC',
      excitementRating: 5
    };
    try {
      const res = await fetch('/api/honeymoon?type=itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItin)
      });
      if (res.ok) {
        const added = await res.json();
        setItinerary(prev => [...prev, added]);
        alert(`📅 Successful itinerary link! Scheduled "${exc.title}" on Day ${dayNum}.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddResearchOption = async () => {
    const categoryItems = research.filter(r => r.category === activeResearchSubtab);
    const nextOptionNum = categoryItems.reduce((max, item) => Math.max(max, item.optionNumber || 0), 0) + 1;

    const newOption: Partial<ResearchItem> = {
      category: activeResearchSubtab,
      optionNumber: nextOptionNum,
      title: `New ${activeResearchSubtab === 'flights' ? 'Flight' : 'Lodging'} Option`,
      cost: 0,
      amenities: '',
      cancellationTerms: '',
      pros: '',
      cons: '',
      status: 'comparing',
      ...(activeResearchSubtab === 'flights' ? {
        airportWebsite: '',
        phoneNumber: '',
        baggageAllowance: '',
        terminalInfo: '',
        layoverDetails: '',
        bookingLink: ''
      } : {
        website: '',
        email: '',
        checkInTime: '',
        checkOutTime: '',
        roomType: '',
        breakfastIncluded: false,
        cancellationDeadline: '',
        depositStatus: '',
        address: ''
      })
    };

    try {
      const res = await fetch('/api/honeymoon?type=research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOption)
      });
      if (res.ok) {
        const added = await res.json();
        setResearch(prev => [...prev, added]);
      }
    } catch (err) {
      console.error('Failed to add research option:', err);
    }
  };

  const handleDeleteResearchOption = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comparison option?')) return;
    try {
      const res = await fetch(`/api/honeymoon?type=research&id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setResearch(prev => prev.filter(r => r._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete research option:', err);
    }
  };

  // Research Comparisons & Reservation Pipeline
  const handleUpdateResearch = async (item: ResearchItem, field: keyof ResearchItem, value: any) => {
    const updatedItem = { ...item, [field]: value };
    try {
      const res = await fetch('/api/honeymoon?type=research', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });
      if (res.ok) {
        setResearch(research.map(r => r._id === item._id ? updatedItem : r));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReserveResearchItem = async (item: ResearchItem) => {
    // 1. Mark as reserved
    await handleUpdateResearch(item, 'status', 'reserved');
    // Set other options in same category to comparing
    const categoryOthers = research.filter(r => r.category === item.category && r._id !== item._id);
    for (const other of categoryOthers) {
      if (other.status === 'reserved') {
        await handleUpdateResearch(other, 'status', 'comparing');
      }
    }

    // Reactively update local view
    setResearch(prev => prev.map(r => {
      if (r._id === item._id) return { ...r, status: 'reserved' };
      if (r.category === item.category) return { ...r, status: 'comparing' };
      return r;
    }));

    // 2. Add automatically to Budget ledger
    const matchingExpenseCategory = 
      item.category === 'flights' ? 'Flights' : 
      item.category === 'lodging' ? 'Lodging' : 'Activities';

    const newExp = {
      category: matchingExpenseCategory,
      name: `Reserved: ${item.title}`,
      estimated: item.cost,
      actual: 0,
      contributor: '',
      contribution: 0
    };

    try {
      const resExp = await fetch('/api/honeymoon?type=expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExp)
      });
      if (resExp.ok) {
        const addedExp = await resExp.json();
        setExpenses(prev => [...prev, addedExp]);
      }
    } catch (e) {
      console.error(e);
    }

    // 3. Add to Day-by-Day itinerary
    const targetDay = item.category === 'activities' ? 2 : 1;
    const targetType = 
      item.category === 'flights' ? 'transit' : 
      item.category === 'lodging' ? 'lodging' : 'excursion';

    const newItin = {
      dayNumber: targetDay,
      timeOfDay: 'Afternoon',
      activityType: targetType as any,
      title: `Check-in / Depart: ${item.title}`,
      cost: item.cost,
      notes: `Imported reservation from comparative research board. Info: ${item.amenities}`,
      reservationCode: 'RES-CONFIRMED',
      excitementRating: 5
    };

    try {
      const resItin = await fetch('/api/honeymoon?type=itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItin)
      });
      if (resItin.ok) {
        const addedItin = await resItin.json();
        setItinerary(prev => [...prev, addedItin]);
      }
    } catch (e) {
      console.error(e);
    }

    // Notify user
    alert(`🎉 Awesome! ${item.title} has been successfully reserved! We've automatically added it to your Itinerary (Day ${targetDay}) and created an expense line in your Budget Ledger.`);
  };

  const handleDeleteDay = async (dayNum: number) => {
    const itemsOnDay = itinerary.filter(i => i.dayNumber === dayNum);
    const itemsAfterDay = itinerary.filter(i => i.dayNumber > dayNum);

    let confirmMsg = `Are you sure you want to delete Day ${dayNum}?`;
    if (itemsOnDay.length > 0) {
      confirmMsg += ` This will also delete the ${itemsOnDay.length} planned items scheduled on Day ${dayNum}.`;
    }
    if (!confirm(confirmMsg)) return;

    try {
      // 1. Delete items on Day d
      const deletePromises = itemsOnDay.map(item =>
        fetch(`/api/honeymoon?type=itinerary&id=${item._id}`, { method: 'DELETE' })
      );
      await Promise.all(deletePromises);

      // 2. Shift dayNumber for items after Day d
      const shiftPromises = itemsAfterDay.map(item =>
        fetch('/api/honeymoon?type=itinerary', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...item, dayNumber: item.dayNumber - 1 })
        })
      );
      await Promise.all(shiftPromises);

      // 3. Update frontend state
      setItinerary(prev => {
        const remaining = prev.filter(i => i.dayNumber !== dayNum);
        return remaining.map(i => i.dayNumber > dayNum ? { ...i, dayNumber: i.dayNumber - 1 } : i);
      });

      // 4. Decrement numDays
      setNumDays(prev => Math.max(1, prev - 1));
    } catch (err) {
      console.error('Failed to delete day:', err);
    }
  };

  // Itinerary CRUD
  const handleAddItineraryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItineraryItem.title?.trim()) return;
    try {
      const res = await fetch('/api/honeymoon?type=itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItineraryItem)
      });
      if (res.ok) {
        const added = await res.json();
        setItinerary([...itinerary, added]);
        setNewItineraryItem({ dayNumber: 1, timeOfDay: 'Morning', activityType: 'excursion', title: '', cost: 0, notes: '', reservationCode: '', excitementRating: 5 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateItinerary = async (item: ItineraryItem, field: keyof ItineraryItem, value: any) => {
    const updated = { ...item, [field]: value };
    try {
      const res = await fetch('/api/honeymoon?type=itinerary', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setItinerary(itinerary.map(i => i._id === item._id ? updated : i));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItinerary = async (id: string) => {
    try {
      const res = await fetch(`/api/honeymoon?type=itinerary&id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setItinerary(itinerary.filter(i => i._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Budget & Gifting
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseItem.name?.trim()) return;
    try {
      const res = await fetch('/api/honeymoon?type=expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpenseItem)
      });
      if (res.ok) {
        const added = await res.json();
        setExpenses([...expenses, added]);
        setNewExpenseItem({ category: settings.customCategories[0] || 'Lodging', name: '', estimated: 0, actual: 0 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateExpense = async (item: Expense, field: keyof Expense, value: any) => {
    const updated = { ...item, [field]: value };
    try {
      const res = await fetch('/api/honeymoon?type=expenses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setExpenses(expenses.map(e => e._id === item._id ? updated : e));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const res = await fetch(`/api/honeymoon?type=expenses&id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setExpenses(expenses.filter(e => e._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Checklist tasks
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    try {
      const res = await fetch('/api/honeymoon?type=tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTaskText.trim(), timeline: newTaskTimeline })
      });
      if (res.ok) {
        const added = await res.json();
        setTasks([...tasks, added]);
        setNewTaskText('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleTask = async (task: Task) => {
    const updated = { ...task, completed: !task.completed };
    try {
      const res = await fetch('/api/honeymoon?type=tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setTasks(tasks.map(t => t._id === task._id ? updated : t));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await fetch(`/api/honeymoon?type=tasks&id=${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  // Packing Lists
  const handleAddPackingItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackingItem.itemName?.trim()) return;
    try {
      const res = await fetch('/api/honeymoon?type=packing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPackingItem)
      });
      if (res.ok) {
        const added = await res.json();
        setPacking([...packing, added]);
        setNewPackingItem({ ...newPackingItem, itemName: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePackingItem = async (item: PackingItem) => {
    const updated = { ...item, packed: !item.packed };
    try {
      const res = await fetch('/api/honeymoon?type=packing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setPacking(packing.map(p => p._id === item._id ? updated : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePackingItem = async (id: string) => {
    try {
      const res = await fetch(`/api/honeymoon?type=packing&id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setPacking(packing.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Document scan secure safe
  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;
    try {
      const res = await fetch('/api/honeymoon?type=docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newDocName.trim(), type: newDocType, secureUrl: '#' })
      });
      if (res.ok) {
        const added = await res.json();
        setDocs([...docs, added]);
        setNewDocName('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    try {
      await fetch(`/api/honeymoon?type=docs&id=${id}`, { method: 'DELETE' });
      setDocs(docs.filter(d => d._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  // --- AIRPORT / AIRLINE REFERENCE DB HANDLERS ---
  const handleUpdateAirport = async (item: Airport, field: keyof Airport, value: string) => {
    const updated = { ...item, [field]: value };
    setAirports(airports.map(a => a._id === item._id ? updated : a));
    try {
      await fetch('/api/honeymoon?type=airports', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
    } catch (e) { console.error(e); }
  };

  const handleDeleteAirport = async (id: string) => {
    try {
      await fetch(`/api/honeymoon?type=airports&id=${id}`, { method: 'DELETE' });
      setAirports(airports.filter(a => a._id !== id));
    } catch (e) { console.error(e); }
  };

  const handleAddAirport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAirport.name?.trim()) return;
    try {
      const res = await fetch('/api/honeymoon?type=airports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newAirport) });
      if (res.ok) {
        const added = await res.json();
        setAirports([...airports, added]);
        setNewAirport({ state: '', city: '', name: '', code: '', website: '', phone: '', notes: '' });
        setShowAddAirport(false);
      }
    } catch (e) { console.error(e); }
  };

  const handleUpdateAirline = async (item: Airline, field: keyof Airline, value: string) => {
    const updated = { ...item, [field]: value };
    setAirlines(airlines.map(a => a._id === item._id ? updated : a));
    try {
      await fetch('/api/honeymoon?type=airlines', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
    } catch (e) { console.error(e); }
  };

  const handleDeleteAirline = async (id: string) => {
    try {
      await fetch(`/api/honeymoon?type=airlines&id=${id}`, { method: 'DELETE' });
      setAirlines(airlines.filter(a => a._id !== id));
    } catch (e) { console.error(e); }
  };

  const handleAddAirline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAirline.name?.trim()) return;
    try {
      const res = await fetch('/api/honeymoon?type=airlines', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newAirline) });
      if (res.ok) {
        const added = await res.json();
        setAirlines([...airlines, added]);
        setNewAirline({ name: '', headquarters: '', website: '', phone: '', notes: '' });
        setShowAddAirline(false);
      }
    } catch (e) { console.error(e); }
  };

  // --- AUTOMATED CALCULATION VARIABLES ---

  const totalEstimated = expenses.reduce((sum, e) => sum + Number(e.estimated || 0), 0);
  const totalActual = expenses.reduce((sum, e) => sum + Number(e.actual || 0), 0);
  const totalRegistryGifts = expenses.reduce((sum, e) => sum + Number(e.contribution || 0), 0);
  const totalVariance = totalEstimated - totalActual;
  const netPocketCost = Math.max(0, totalEstimated - totalRegistryGifts);

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const totalTasksCount = tasks.length || 1;
  const taskProgressPct = Math.round((completedTasksCount / totalTasksCount) * 100);

  const partnerAPacking = packing.filter(p => p.traveler === 'partnerA');
  const partnerAPackedCount = partnerAPacking.filter(p => p.packed).length;
  const partnerAPackingProgress = Math.round((partnerAPackedCount / (partnerAPacking.length || 1)) * 100);

  const partnerBPacking = packing.filter(p => p.traveler === 'partnerB');
  const partnerBPackedCount = partnerBPacking.filter(p => p.packed).length;
  const partnerBPackingProgress = Math.round((partnerBPackedCount / (partnerBPacking.length || 1)) * 100);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--accent-secondary)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ fontFamily: 'var(--font-family)', fontSize: '0.95rem' }}>Syncing relational honeymoon database...</p>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '1rem 2rem' }}>

      {/* Print-only header — revealed by globals.css @media print */}
      <style>{`
        @media print {
          .print-header { display: block !important; text-align: center; border-bottom: 2px solid #333; padding-bottom: 8pt; margin-bottom: 16pt; }
          /* Hide tab ribbon */
          div[style*="background: var(--neutral-gray)"] { display: none !important; }
          /* Honeymoon page wrapper fills full paper width */
          div[style*="maxWidth: '1300px'"] { max-width: 100% !important; padding: 0 !important; }
        }
      `}</style>

      {/* Print-only header */}
      <div className="print-header" style={{ display: 'none' }}>
        <h1 style={{ fontSize: '18pt', fontWeight: 'bold', margin: '0 0 4pt' }}>🌴 Honeymoon Planner</h1>
        <p style={{ fontSize: '11pt', margin: 0 }}>{settings.partnerA} &amp; {settings.partnerB} · {settings.destination} · {settings.startDate} → {settings.endDate}</p>
      </div>


      {/* Premium Dashboard Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '1rem' }}>
        <div>
          <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem', fontWeight: 600 }}>
            ← Back to Wedding Dashboard
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontFamily: 'var(--font-family)', fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              🌴 All-in-One Honeymoon Planner
            </h1>
            <span style={{ fontSize: '0.75rem', background: 'rgba(111, 66, 193, 0.1)', color: 'var(--accent-primary)', fontWeight: 700, padding: '0.25rem 0.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#28a745', display: 'inline-block', boxShadow: '0 0 8px #28a745' }}></span>
              Connected & Synced
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Coordinate your dream getaway with {settings.partnerA} & {settings.partnerB}. Plan destinations, budget splits, itinerary blocks, and dual checklists.
          </p>
        </div>

        {/* Right side: Stats + Print */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>

          {/* Global Travel Stats Widget */}
          <div style={{ display: 'flex', gap: '1rem', background: 'var(--bg-secondary)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ textAlign: 'center', borderRight: '1px solid var(--neutral-gray)', paddingRight: '1rem' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Days Until Travel</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{daysRemaining} Days</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Selected Escape</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>📍 {settings.destination || 'Unselected'}</span>
            </div>
          </div>

          {/* 🖨️ Print Button */}
          <div style={{ position: 'relative' }} className="no-print">
            <button
              onClick={() => setShowPrintMenu(!showPrintMenu)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #343a40 0%, #495057 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            >
              🖨️ Print Planner
              <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>▼</span>
            </button>
            {showPrintMenu && (
              <div style={{ position: 'absolute', right: 0, top: '110%', background: 'white', border: '1px solid var(--neutral-gray)', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, minWidth: '220px', overflow: 'hidden' }}>
                <div style={{ padding: '0.6rem 0.85rem', background: 'var(--bg-secondary)', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select Section to Print</div>
                {[
                  { key: 'current', label: '📄 Current Tab', desc: 'Print whatever tab is open' },
                  { key: 'start', label: '🎬 Onboarding & Settings', desc: 'Config, categories, traveler names' },
                  { key: 'destination', label: '🗺️ Destinations', desc: 'All candidate destinations + excursions' },
                  { key: 'research', label: '🔍 Flights & Hotels', desc: 'All comparison options + airport DB' },
                  { key: 'itinerary', label: '📅 Full Itinerary', desc: 'Full travel timeline schedule' },
                  { key: 'budget', label: '💰 Budget Ledger', desc: 'All expenses & currency converter' },
                  { key: 'checklist', label: '⏳ Milestone Checklist', desc: 'All countdown tasks' },
                  { key: 'packing', label: '🎒 Packing Lists', desc: 'Both traveler checklists' },
                  { key: 'overview', label: '📊 Master Dashboard', desc: 'Full overview & analytics' },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => handlePrint(opt.key)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', padding: '0.6rem 0.85rem', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: '1px solid var(--neutral-gray)', textAlign: 'left' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)' }}>{opt.label}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{opt.desc}</span>
                  </button>
                ))}
              </div>
            )}
            {showPrintMenu && <div onClick={() => setShowPrintMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />}
          </div>
        </div>
      </div>

      {/* 8-Tab Workbook Spreadsheet Ribbon Layout */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', background: 'var(--neutral-gray)', padding: '0.35rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
        {[
          { id: 'start', label: '🎬 Onboarding Config', color: 'var(--accent-primary)' },
          { id: 'destination', label: '🗺️ Destination Matcher', color: '#007bff' },
          { id: 'research', label: '🔍 Flights & Hotels', color: '#17a2b8' },
          { id: 'itinerary', label: '📅 Daily Itinerary', color: '#fd7e14' },
          { id: 'budget', label: '💰 Budget Ledger', color: '#28a745' },
          { id: 'checklist', label: '⏳ Milestone Checklist', color: '#6c757d' },
          { id: 'packing', label: '🎒 Suitcase Packing', color: '#e83e8c' },
          { id: 'overview', label: '📊 Master Dashboard', color: '#343a40' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: '1 1 auto',
              padding: '0.6rem 1rem',
              background: activeTab === tab.id ? 'var(--bg-secondary)' : 'transparent',
              color: activeTab === tab.id ? tab.color : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease-in-out',
              boxShadow: activeTab === tab.id ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- TAB CONTENT AREA --- */}

      {/* TAB 1: START */}
      {activeTab === 'start' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
          
          {/* Left: Beautiful welcoming & onboarding */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '2rem', background: 'linear-gradient(135deg, #6F42C1 0%, #a272ff 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 800, background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', borderRadius: '10px' }}>Beginner-Friendly Hub</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.75rem', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>Welcome to your Honeymoon Workspace</h2>
                <p style={{ opacity: 0.9, fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Plan, budget, research options, and synchronize packing checkmarks with your partner in real time. Follow the interactive checklist or trigger the AI discovery engine in other tabs to speed up scheduling.
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button onClick={() => setActiveTab('destination')} className="btn" style={{ background: 'white', color: 'var(--accent-primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>Compare Destinations</button>
                  <button onClick={() => setActiveTab('overview')} className="btn" style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.4)' }}>View Master Dashboard</button>
                </div>
              </div>
              <div style={{ position: 'absolute', right: '-20px', bottom: '-40px', fontSize: '10rem', opacity: 0.15, transform: 'rotate(15deg)', userSelect: 'none' }}>🌴</div>
            </div>

            {/* Quick tips list */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem' }}>💡 Quick Start Planner Guidelines</h3>
              <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', paddingLeft: '1.25rem' }}>
                <li>Configure customized traveler names and base currency in settings panel.</li>
                <li>Flesh out candidate destinations by scoring them, adding YouTube review links, and attaching excursions directly.</li>
                <li>Use flights & lodging comparison matrices to log options, complete with baggage rules, websites, and check-in conditions.</li>
                <li>Confirm selections to automatically pipeline reservations into daily calendars and budget ledger sheets.</li>
              </ul>
            </div>
          </div>

          {/* Right: Quick settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem' }}>👤 Travelers Names Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Traveler A Name</label>
                  <input
                    type="text"
                    value={settings.partnerA}
                    onChange={(e) => handleUpdateSettings({ partnerA: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Traveler B Name</label>
                  <input
                    type="text"
                    value={settings.partnerB}
                    onChange={(e) => handleUpdateSettings({ partnerB: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Departure Date</label>
                    <input
                      type="date"
                      value={settings.startDate}
                      onChange={(e) => handleUpdateSettings({ startDate: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Return Date</label>
                    <input
                      type="date"
                      value={settings.endDate}
                      onChange={(e) => handleUpdateSettings({ endDate: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Planner Base Currency</label>
                  <select
                    value={settings.baseCurrency}
                    onChange={(e) => handleUpdateSettings({ baseCurrency: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.85rem', background: 'var(--bg-secondary)' }}
                  >
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="AUD">AUD (A$) - Australian Dollar</option>
                    <option value="CAD">CAD (C$) - Canadian Dollar</option>
                    <option value="JPY">JPY (¥) - Japanese Yen</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem' }}>% Custom Budget Categories</h3>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                {settings.customCategories.map(cat => (
                  <span
                    key={cat}
                    style={{
                      background: 'var(--neutral-gray)',
                      color: 'var(--text-primary)',
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontWeight: 600
                    }}
                  >
                    {cat}
                    <button 
                      onClick={() => handleRemoveCategory(cat)}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.75rem', color: '#b91c1c', padding: 0 }}
                      title="Remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Add custom category..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  style={{ flex: 1, padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem' }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Add</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DESTINATION */}
      {activeTab === 'destination' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Description */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>🗺️ Candidate Destination Matcher</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Flesh out up to 3 candidate destinations. Log local currencies, power adapters, safety indices, tipping rules, and research excursions specifically attached relational-style to each destination.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            
            {/* Left: Destination Comparator Matrices */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {destinations.map(d => {
                const destinationExcursions = excursions.filter(e => e.destinationName === d.name);
                return (
                  <div 
                    key={d._id} 
                    className="card" 
                    style={{ 
                      padding: '1.5rem', 
                      position: 'relative', 
                      border: d.status === 'selected' ? '2.5px solid var(--accent-primary)' : '1px solid var(--neutral-gray)',
                      boxShadow: d.status === 'selected' ? '0 8px 24px rgba(111,66,193,0.1)' : '0 4px 12px rgba(0,0,0,0.02)'
                    }}
                  >
                    {d.status === 'selected' && (
                      <span style={{ position: 'absolute', top: '-12px', right: '15px', background: 'var(--accent-primary)', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '10px', textTransform: 'uppercase' }}>
                        Selected Destination
                      </span>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>📍 {d.name}</h4>
                      <button onClick={() => handleDeleteDestination(d._id!)} style={{ border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer', fontSize: '1rem' }}>🗑️ Delete Destination</button>
                    </div>

                    {/* Standard Information */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Best Weather Months</label>
                        <input
                          type="text"
                          value={d.bestMonths || ''}
                          onChange={(e) => handleUpdateDestination(d, 'bestMonths', e.target.value)}
                          placeholder="e.g. October to April"
                          style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)', fontSize: '0.8rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Safety Advisory Rating</label>
                        <input
                          type="text"
                          value={d.safetyRank || ''}
                          onChange={(e) => handleUpdateDestination(d, 'safetyRank', e.target.value)}
                          placeholder="e.g. Level 1 - Safe"
                          style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)', fontSize: '0.8rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Language Spoken</label>
                        <input
                          type="text"
                          value={d.language || ''}
                          onChange={(e) => handleUpdateDestination(d, 'language', e.target.value)}
                          placeholder="e.g. Spanish"
                          style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)', fontSize: '0.75rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Local Currency</label>
                        <input
                          type="text"
                          value={d.localCurrency || ''}
                          onChange={(e) => handleUpdateDestination(d, 'localCurrency', e.target.value)}
                          placeholder="e.g. EUR (€)"
                          style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)', fontSize: '0.75rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Power Plug Type</label>
                        <input
                          type="text"
                          value={d.plugType || ''}
                          onChange={(e) => handleUpdateDestination(d, 'plugType', e.target.value)}
                          placeholder="e.g. Type C"
                          style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)', fontSize: '0.75rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Visa Conditions</label>
                        <input
                          type="text"
                          value={d.visaRequired}
                          onChange={(e) => handleUpdateDestination(d, 'visaRequired', e.target.value)}
                          placeholder="e.g. 90 Days Visa Free"
                          style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)', fontSize: '0.8rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Rating / Match Score (1-10)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={d.score}
                            onChange={(e) => handleUpdateDestination(d, 'score', Number(e.target.value))}
                            style={{ flex: 1, accentColor: 'var(--accent-primary)' }}
                          />
                          <span style={{ fontWeight: 800 }}>{d.score}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Tipping Guidelines / Culture</label>
                      <input
                        type="text"
                        value={d.tippingNotes || ''}
                        onChange={(e) => handleUpdateDestination(d, 'tippingNotes', e.target.value)}
                        placeholder="e.g. 10% round up is standard..."
                        style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)', fontSize: '0.8rem' }}
                      />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Pros, Cons & Notes</label>
                      <textarea
                        rows={2}
                        value={d.notes}
                        onChange={(e) => handleUpdateDestination(d, 'notes', e.target.value)}
                        placeholder="Traditional village streets vs high flight overheads..."
                        style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)', fontSize: '0.8rem', resize: 'vertical' }}
                      />
                    </div>

                    {/* YouTube Video List for Destination */}
                    <div style={{ marginBottom: '1rem', borderTop: '1px solid var(--neutral-gray)', paddingTop: '0.75rem' }}>
                      <label style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>📹 YouTube Destination Review Guides</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                        {d.youtubeVideos && d.youtubeVideos.map((vid, idx) => (
                          <span key={idx} style={{ background: '#ff0000', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}>
                            📺 <a href={vid} target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none' }}>Video #{idx+1}</a>
                            <button
                              onClick={() => {
                                const remaining = d.youtubeVideos!.filter((_, i) => i !== idx);
                                handleUpdateDestination(d, 'youtubeVideos', remaining);
                              }}
                              style={{ border: 'none', background: 'transparent', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', padding: 0 }}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        {(!d.youtubeVideos || d.youtubeVideos.length === 0) && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No YouTube video research added yet. Paste a link below!</span>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <input
                          type="text"
                          placeholder="Paste YouTube video link..."
                          value={tempDestVideoUrl[d._id!] || ''}
                          onChange={(e) => setTempDestVideoUrl({ ...tempDestVideoUrl, [d._id!]: e.target.value })}
                          style={{ flex: 1, padding: '0.3rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.75rem' }}
                        />
                        <button
                          onClick={() => {
                            const val = tempDestVideoUrl[d._id!];
                            if (!val) return;
                            const currentList = d.youtubeVideos || [];
                            handleUpdateDestination(d, 'youtubeVideos', [...currentList, val.trim()]);
                            setTempDestVideoUrl({ ...tempDestVideoUrl, [d._id!]: '' });
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                        >
                          Add Video Link
                        </button>
                      </div>
                    </div>

                    {/* Relational EXCURSIONS Section for Destination */}
                    <div style={{ borderTop: '1px solid var(--neutral-gray)', paddingTop: '0.75rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <h5 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>🧗 Attached Relational Excursions & Activities ({destinationExcursions.length})</h5>
                        <button
                          onClick={() => setExcursionFormForDest(excursionFormForDest === d._id! ? null : d._id!)}
                          className="btn btn-primary"
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.7rem' }}
                        >
                          {excursionFormForDest === d._id! ? 'Close Form' : '➕ Link Excursion'}
                        </button>
                      </div>

                      {/* Excursion Form */}
                      {excursionFormForDest === d._id! && (
                        <form onSubmit={(e) => handleAddExcursionSubmit(e, d.name)} style={{ background: 'white', padding: '1rem', borderRadius: '6px', border: '1px solid var(--neutral-gray)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                          <h6 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700 }}>Add Excursion linked to {d.name}</h6>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.35rem' }}>
                            <input
                              type="text"
                              placeholder="Excursion Title (e.g. Sunset Lagoon Swim)"
                              value={newExcursion.title}
                              onChange={(e) => setNewExcursion({ ...newExcursion, title: e.target.value })}
                              style={{ padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.75rem' }}
                              required
                            />
                            <input
                              type="number"
                              placeholder="Price ($)"
                              value={newExcursion.price || ''}
                              onChange={(e) => setNewExcursion({ ...newExcursion, price: Number(e.target.value) })}
                              style={{ padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.75rem' }}
                              required
                            />
                          </div>

                          <input
                            type="text"
                            placeholder="Address"
                            value={newExcursion.address}
                            onChange={(e) => setNewExcursion({ ...newExcursion, address: e.target.value })}
                            style={{ padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.75rem' }}
                          />

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                            <input
                              type="text"
                              placeholder="Phone Number"
                              value={newExcursion.phoneNumber}
                              onChange={(e) => setNewExcursion({ ...newExcursion, phoneNumber: e.target.value })}
                              style={{ padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.75rem' }}
                            />
                            <input
                              type="text"
                              placeholder="Concierge Email"
                              value={newExcursion.email}
                              onChange={(e) => setNewExcursion({ ...newExcursion, email: e.target.value })}
                              style={{ padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.75rem' }}
                            />
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                            <input
                              type="text"
                              placeholder="Website URL"
                              value={newExcursion.website}
                              onChange={(e) => setNewExcursion({ ...newExcursion, website: e.target.value })}
                              style={{ padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.75rem' }}
                            />
                            <input
                              type="text"
                              placeholder="YouTube review video link..."
                              value={tempExcVideoUrl}
                              onChange={(e) => setTempExcVideoUrl(e.target.value)}
                              style={{ padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.75rem' }}
                            />
                          </div>

                          <textarea
                            rows={2}
                            placeholder="Add Excursion notes, tips, and other useful information..."
                            value={newExcursion.notes}
                            onChange={(e) => setNewExcursion({ ...newExcursion, notes: e.target.value })}
                            style={{ padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.75rem', resize: 'vertical' }}
                          />

                          <button 
                            type="submit" 
                            className="btn btn-primary" 
                            style={{ padding: '0.35rem', fontSize: '0.75rem' }}
                            onClick={() => {
                              if (tempExcVideoUrl.trim()) {
                                newExcursion.youtubeVideos = [tempExcVideoUrl.trim()];
                                setTempExcVideoUrl('');
                              }
                            }}
                          >
                            💾 Save & Attach Excursion
                          </button>
                        </form>
                      )}

                      {/* Excursions Cards */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {destinationExcursions.map(exc => (
                          <div key={exc._id} style={{ background: 'white', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--neutral-gray)', fontSize: '0.8rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800 }}>🧗 {exc.title}</h6>
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)' }}>${exc.price}</span>
                            </div>

                            <p style={{ margin: '0.35rem 0', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{exc.notes}</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', margin: '0.35rem 0', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                              <div>📍 {exc.address || 'No address logged'}</div>
                              <div>📞 {exc.phoneNumber || 'No phone logged'}</div>
                              <div>✉️ {exc.email || 'No email logged'}</div>
                              <div>
                                🌐 {exc.website ? (
                                  <a href={exc.website} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--accent-primary)', fontWeight: 600 }}>Visit Website</a>
                                ) : 'No website logged'}
                              </div>
                            </div>

                            {/* Media Link */}
                            {exc.youtubeVideos && exc.youtubeVideos.length > 0 && (
                              <div style={{ marginTop: '0.25rem' }}>
                                {exc.youtubeVideos.map((url, i) => (
                                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.65rem', background: '#ff0000', color: 'white', padding: '0.15rem 0.4rem', borderRadius: '3px', textDecoration: 'none', fontWeight: 700, display: 'inline-block', marginRight: '0.25rem' }}>
                                    📺 Watch Review #{i+1}
                                  </a>
                                ))}
                              </div>
                            )}

                            {/* Pipeline operations for excursion */}
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', borderTop: '1px dashed var(--neutral-gray)', paddingTop: '0.5rem' }}>
                              <button
                                onClick={() => handlePushExcursionToBudget(exc)}
                                style={{ background: 'rgba(40,167,69,0.08)', border: 'none', color: '#28a745', fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700, cursor: 'pointer' }}
                              >
                                💰 Copy to Budget
                              </button>
                              <button
                                onClick={() => {
                                  const day = prompt('Which trip day would you like to schedule this excursion on? (e.g. 1, 2, 3)', '2');
                                  if (day) handlePushExcursionToItinerary(exc, Number(day));
                                }}
                                style={{ background: 'rgba(253,126,20,0.08)', border: 'none', color: '#fd7e14', fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700, cursor: 'pointer' }}
                              >
                                📅 Link to Day Schedule
                              </button>
                              <button
                                onClick={() => handleDeleteExcursion(exc._id!)}
                                style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#dc3545', fontSize: '0.65rem', cursor: 'pointer' }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                        {destinationExcursions.length === 0 && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center', display: 'block', padding: '0.5rem 0' }}>No excursions attached. Link a new activity above!</span>
                        )}
                      </div>
                    </div>

                    {d.status !== 'selected' ? (
                      <button
                        onClick={() => handleUpdateDestination(d, 'status', 'selected')}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem', marginTop: '1rem' }}
                      >
                        🔒 Lock In Destination
                      </button>
                    ) : (
                      <div style={{ textAlign: 'center', color: '#28a745', fontWeight: 700, padding: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', marginTop: '1rem' }}>
                        ✅ Selected for Wedding Countdown
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Side: Quick Add Destination & Safety Auditor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div className="card" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem' }}>➕ Add Destination Option</h4>
                <form onSubmit={handleAddDestination} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="e.g. Amalfi Coast Suite"
                    value={newDestName}
                    onChange={(e) => setNewDestName(e.target.value)}
                    style={{ padding: '0.5rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.85rem' }}
                    required
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem' }}>Add Option</button>
                </form>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem' }}>🛡️ Safety Clearance Auditor</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Passport Expiration Date</label>
                    <input
                      type="date"
                      value={passportExpiry}
                      onChange={(e) => setPassportExpiry(e.target.value)}
                      style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {safetyAlerts.length > 0 ? (
                      safetyAlerts.map((alert, index) => (
                        <div
                          key={index}
                          style={{
                            padding: '0.75rem',
                            background: alert.type === 'error' ? 'rgba(220, 53, 69, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                            borderLeft: `3px solid ${alert.type === 'error' ? '#dc3545' : '#ffc107'}`,
                            borderRadius: '4px',
                            color: alert.type === 'error' ? '#721c24' : '#856404',
                            fontSize: '0.75rem',
                            lineHeight: '1.4'
                          }}
                        >
                          {alert.message}
                        </div>
                      ))
                    ) : (
                      <div style={{ background: 'rgba(40, 167, 69, 0.1)', color: '#155724', padding: '0.75rem', borderRadius: '4px', borderLeft: '3px solid #28a745', fontSize: '0.75rem', fontWeight: 600, textAlign: 'center' }}>
                        ✅ All Passport Validity & Weather Checks Passed!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: RESEARCH & RESERVATION */}
      {activeTab === 'research' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>🔍 Option Comparison Board & Pipeline</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Compare options for Flights and Lodging. Click <strong>"Confirm & Reserve"</strong> on any option to copy booking details to daily itinerary calendar and budget ledger sheets.
            </p>
          </div>

          {/* Subtabs selection ribbon */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { id: 'flights', label: '✈️ Flights Operational Grid' },
                { id: 'lodging', label: '🏨 Lodging & Resorts Registry' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setNewExpenseItem({ category: sub.id === 'flights' ? 'Flights' : 'Lodging' })} // state hook sync
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    background: activeResearchSubtab === sub.id ? 'var(--accent-secondary)' : 'transparent',
                    color: activeResearchSubtab === sub.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.825rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onClickCapture={() => setActiveResearchSubtab(sub.id as any)}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleAddResearchOption}
              className="btn btn-primary"
              style={{
                fontSize: '0.8rem',
                padding: '0.5rem 1rem',
                background: 'var(--accent-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ➕ Add Custom {activeResearchSubtab === 'flights' ? 'Flight' : 'Lodging'} Option
            </button>
          </div>

          {/* Comparisons Matrix Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {research
              .filter(r => r.category === activeResearchSubtab)
              .map(item => (
                <div 
                  key={item._id} 
                  className="card" 
                  style={{ 
                    padding: '1.5rem', 
                    border: item.status === 'reserved' ? '2.5px solid #28a745' : '1px solid var(--neutral-gray)',
                    background: item.status === 'reserved' ? 'rgba(40,167,69,0.02)' : 'white'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, background: 'var(--neutral-gray)', color: 'var(--text-secondary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      Option #{item.optionNumber}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {item.status === 'reserved' && (
                        <span style={{ background: '#28a745', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          RESERVED
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteResearchOption(item._id!)}
                        style={{ border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, padding: '0.2rem 0.4rem' }}
                        title="Delete this option"
                      >
                        🗑️ Delete Option
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Option Title</span>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateResearch(item, 'title', e.target.value)}
                        style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)', fontWeight: 600 }}
                      />
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Estimated Total Cost</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ fontWeight: 600 }}>{settings.baseCurrency === 'EUR' ? '€' : settings.baseCurrency === 'GBP' ? '£' : '$'}</span>
                        <input
                          type="number"
                          value={item.cost}
                          onChange={(e) => handleUpdateResearch(item, 'cost', Number(e.target.value))}
                          style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                        />
                      </div>
                    </div>

                    {/* --- FLIGHTS SPECIFIC FIELDS --- */}
                    {activeResearchSubtab === 'flights' && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <div>
                            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Airport Link</span>
                            <input
                              type="text"
                              value={item.airportWebsite || ''}
                              onChange={(e) => handleUpdateResearch(item, 'airportWebsite', e.target.value)}
                              placeholder="Website"
                              style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)', fontSize: '0.8rem' }}
                            />
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Airline Phone</span>
                            <input
                              type="text"
                              value={item.phoneNumber || ''}
                              onChange={(e) => handleUpdateResearch(item, 'phoneNumber', e.target.value)}
                              placeholder="Phone"
                              style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)', fontSize: '0.8rem' }}
                            />
                          </div>
                        </div>

                        <div>
                          <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Baggage Allowances</span>
                          <input
                            type="text"
                            value={item.baggageAllowance || ''}
                            onChange={(e) => handleUpdateResearch(item, 'baggageAllowance', e.target.value)}
                            placeholder="e.g. 2 checked bags free"
                            style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.5rem' }}>
                          <div>
                            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Terminals Info</span>
                            <input
                              type="text"
                              value={item.terminalInfo || ''}
                              onChange={(e) => handleUpdateResearch(item, 'terminalInfo', e.target.value)}
                              placeholder="e.g. Terminal B LAX"
                              style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                            />
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Layover Details</span>
                            <input
                              type="text"
                              value={item.layoverDetails || ''}
                              onChange={(e) => handleUpdateResearch(item, 'layoverDetails', e.target.value)}
                              placeholder="e.g. Non-stop"
                              style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                            />
                          </div>
                        </div>

                        <div>
                          <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Booking/Reservation Link</span>
                          <input
                            type="text"
                            value={item.bookingLink || ''}
                            onChange={(e) => handleUpdateResearch(item, 'bookingLink', e.target.value)}
                            placeholder="Link URL"
                            style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                          />
                        </div>
                      </>
                    )}

                    {/* --- LODGING SPECIFIC FIELDS --- */}
                    {activeResearchSubtab === 'lodging' && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <div>
                            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Resort Website</span>
                            <input
                              type="text"
                              value={item.website || ''}
                              onChange={(e) => handleUpdateResearch(item, 'website', e.target.value)}
                              placeholder="Website URL"
                              style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)', fontSize: '0.8rem' }}
                            />
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Concierge Phone</span>
                            <input
                              type="text"
                              value={item.phoneNumber || ''}
                              onChange={(e) => handleUpdateResearch(item, 'phoneNumber', e.target.value)}
                              placeholder="Phone"
                              style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)', fontSize: '0.8rem' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.5rem' }}>
                          <div>
                            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Resort Email</span>
                            <input
                              type="text"
                              value={item.email || ''}
                              onChange={(e) => handleUpdateResearch(item, 'email', e.target.value)}
                              placeholder="Email Address"
                              style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)', fontSize: '0.8rem' }}
                            />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Breakfast Inc?</span>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
                              <input
                                type="checkbox"
                                checked={item.breakfastIncluded || false}
                                onChange={(e) => handleUpdateResearch(item, 'breakfastIncluded', e.target.checked)}
                                style={{ accentColor: 'var(--accent-primary)' }}
                              />
                              Yes
                            </label>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <div>
                            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Check-In Time</span>
                            <input
                              type="text"
                              value={item.checkInTime || ''}
                              onChange={(e) => handleUpdateResearch(item, 'checkInTime', e.target.value)}
                              placeholder="e.g. 15:00"
                              style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                            />
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Check-Out Time</span>
                            <input
                              type="text"
                              value={item.checkOutTime || ''}
                              onChange={(e) => handleUpdateResearch(item, 'checkOutTime', e.target.value)}
                              placeholder="e.g. 11:00"
                              style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                            />
                          </div>
                        </div>

                        <div>
                          <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Room Type / Category</span>
                          <input
                            type="text"
                            value={item.roomType || ''}
                            onChange={(e) => handleUpdateResearch(item, 'roomType', e.target.value)}
                            placeholder="e.g. Overwater Bungalow"
                            style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <div>
                            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Cancel Deadline</span>
                            <input
                              type="text"
                              value={item.cancellationDeadline || ''}
                              onChange={(e) => handleUpdateResearch(item, 'cancellationDeadline', e.target.value)}
                              placeholder="e.g. 2026-09-01"
                              style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)', fontSize: '0.8rem' }}
                            />
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Deposit Status</span>
                            <input
                              type="text"
                              value={item.depositStatus || ''}
                              onChange={(e) => handleUpdateResearch(item, 'depositStatus', e.target.value)}
                              placeholder="e.g. Paid in full"
                              style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)', fontSize: '0.8rem' }}
                            />
                          </div>
                        </div>

                        <div>
                          <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Resort Address</span>
                          <input
                            type="text"
                            value={item.address || ''}
                            onChange={(e) => handleUpdateResearch(item, 'address', e.target.value)}
                            placeholder="Full physical map address"
                            style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                          />
                        </div>
                      </>
                    )}

                    {/* Shared Info */}
                    <div>
                      <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Included Amenities / Features</span>
                      <input
                        type="text"
                        value={item.amenities}
                        onChange={(e) => handleUpdateResearch(item, 'amenities', e.target.value)}
                        placeholder="e.g. Free Wi-Fi, laundry service"
                        style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                      />
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Cancellation Terms Summary</span>
                      <input
                        type="text"
                        value={item.cancellationTerms}
                        onChange={(e) => handleUpdateResearch(item, 'cancellationTerms', e.target.value)}
                        placeholder="e.g. Free cancellation up to 48 hours"
                        style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div>
                        <span style={{ color: '#28a745', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Pros</span>
                        <input
                          type="text"
                          value={item.pros}
                          onChange={(e) => handleUpdateResearch(item, 'pros', e.target.value)}
                          style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                        />
                      </div>
                      <div>
                        <span style={{ color: '#dc3545', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Cons</span>
                        <input
                          type="text"
                          value={item.cons}
                          onChange={(e) => handleUpdateResearch(item, 'cons', e.target.value)}
                          style={{ width: '100%', padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                        />
                      </div>
                    </div>

                    {item.status !== 'reserved' ? (
                      <button
                        onClick={() => handleReserveResearchItem(item)}
                        className="btn btn-primary"
                        style={{ width: '100%', background: '#28a745', border: 'none', padding: '0.5rem', fontSize: '0.8rem', marginTop: '0.5rem' }}
                      >
                        ✅ Confirm & Reserve This Option
                      </button>
                    ) : (
                      <div style={{ background: 'rgba(40,167,69,0.1)', color: '#28a745', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center', marginTop: '0.5rem' }}>
                        🎉 Option Reserved & Synced to Sheets!
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* ✈️ AIRPORT REFERENCE DATABASE */}
          <div className="card" style={{ padding: '1.5rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>✈️ US Airport Reference Database</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>{airports.length} airports loaded — search, edit, or add custom entries</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setShowAddAirport(!showAddAirport)} className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>➕ Add Airport</button>
                <button onClick={() => setShowAirportDB(!showAirportDB)} style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', background: 'transparent', cursor: 'pointer', fontWeight: 700 }}>
                  {showAirportDB ? '▲ Collapse' : '▼ Browse All'}
                </button>
              </div>
            </div>

            {showAddAirport && (
              <form onSubmit={handleAddAirport} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.4rem', marginBottom: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                <input placeholder="Airport Name *" value={newAirport.name || ''} onChange={e => setNewAirport({ ...newAirport, name: e.target.value })} required style={{ padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.78rem' }} />
                <input placeholder="IATA Code (e.g. LAX)" value={newAirport.code || ''} onChange={e => setNewAirport({ ...newAirport, code: e.target.value.toUpperCase() })} style={{ padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.78rem' }} />
                <input placeholder="City" value={newAirport.city || ''} onChange={e => setNewAirport({ ...newAirport, city: e.target.value })} style={{ padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.78rem' }} />
                <input placeholder="State" value={newAirport.state || ''} onChange={e => setNewAirport({ ...newAirport, state: e.target.value })} style={{ padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.78rem' }} />
                <input placeholder="Website URL" value={newAirport.website || ''} onChange={e => setNewAirport({ ...newAirport, website: e.target.value })} style={{ padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.78rem', gridColumn: 'span 2' }} />
                <input placeholder="Phone Number" value={newAirport.phone || ''} onChange={e => setNewAirport({ ...newAirport, phone: e.target.value })} style={{ padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.78rem' }} />
                <button type="submit" className="btn btn-primary" style={{ fontSize: '0.78rem' }}>💾 Save Airport</button>
              </form>
            )}

            {/* Search + State Filter */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                placeholder="🔍 Search by name, city, or code..."
                value={airportSearch}
                onChange={e => setAirportSearch(e.target.value)}
                style={{ flex: 1, padding: '0.4rem 0.75rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem' }}
              />
              <select
                value={airportStateFilter}
                onChange={e => setAirportStateFilter(e.target.value)}
                style={{ padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem', background: 'var(--bg-secondary)', minWidth: '150px' }}
              >
                <option value="All">All States</option>
                {[...new Set(airports.map(a => a.state))].sort().map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {showAirportDB && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--neutral-gray)' }}>
                      {['Code', 'Airport Name', 'City', 'State', 'Website', 'Phone', 'Notes', ''].map(h => (
                        <th key={h} style={{ padding: '0.5rem 0.6rem', textAlign: 'left', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {airports
                      .filter(a => {
                        const q = airportSearch.toLowerCase();
                        const matchSearch = !q || a.name.toLowerCase().includes(q) || a.city.toLowerCase().includes(q) || a.code.toLowerCase().includes(q);
                        const matchState = airportStateFilter === 'All' || a.state === airportStateFilter;
                        return matchSearch && matchState;
                      })
                      .map(a => (
                        <tr key={a._id} style={{ borderBottom: '1px solid var(--neutral-gray)', transition: 'background 0.15s' }} onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <td style={{ padding: '0.4rem 0.6rem' }}>
                            <span style={{ background: 'var(--accent-secondary)', color: 'var(--accent-primary)', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem' }}>{a.code}</span>
                          </td>
                          {editingAirport === a._id ? (
                            <>
                              <td style={{ padding: '0.3rem' }}><input value={a.name} onChange={e => handleUpdateAirport(a, 'name', e.target.value)} style={{ width: '100%', padding: '0.25rem', border: '1px solid var(--accent-primary)', borderRadius: '3px', fontSize: '0.75rem' }} /></td>
                              <td style={{ padding: '0.3rem' }}><input value={a.city} onChange={e => handleUpdateAirport(a, 'city', e.target.value)} style={{ width: '100%', padding: '0.25rem', border: '1px solid var(--neutral-gray)', borderRadius: '3px', fontSize: '0.75rem' }} /></td>
                              <td style={{ padding: '0.3rem' }}><input value={a.state} onChange={e => handleUpdateAirport(a, 'state', e.target.value)} style={{ width: '100%', padding: '0.25rem', border: '1px solid var(--neutral-gray)', borderRadius: '3px', fontSize: '0.75rem' }} /></td>
                              <td style={{ padding: '0.3rem' }}><input value={a.website} onChange={e => handleUpdateAirport(a, 'website', e.target.value)} style={{ width: '100%', padding: '0.25rem', border: '1px solid var(--neutral-gray)', borderRadius: '3px', fontSize: '0.75rem' }} /></td>
                              <td style={{ padding: '0.3rem' }}><input value={a.phone} onChange={e => handleUpdateAirport(a, 'phone', e.target.value)} style={{ width: '100%', padding: '0.25rem', border: '1px solid var(--neutral-gray)', borderRadius: '3px', fontSize: '0.75rem' }} /></td>
                              <td style={{ padding: '0.3rem' }}><input value={a.notes} onChange={e => handleUpdateAirport(a, 'notes', e.target.value)} style={{ width: '100%', padding: '0.25rem', border: '1px solid var(--neutral-gray)', borderRadius: '3px', fontSize: '0.75rem' }} /></td>
                            </>
                          ) : (
                            <>
                              <td style={{ padding: '0.4rem 0.6rem', fontWeight: 600 }}>{a.name}</td>
                              <td style={{ padding: '0.4rem 0.6rem', color: 'var(--text-secondary)' }}>{a.city}</td>
                              <td style={{ padding: '0.4rem 0.6rem', color: 'var(--text-secondary)' }}>{a.state}</td>
                              <td style={{ padding: '0.4rem 0.6rem' }}>{a.website ? <a href={a.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.75rem', textDecoration: 'none' }}>🌐 Visit</a> : <span style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>—</span>}</td>
                              <td style={{ padding: '0.4rem 0.6rem', color: 'var(--text-secondary)' }}>{a.phone || '—'}</td>
                              <td style={{ padding: '0.4rem 0.6rem', color: 'var(--text-secondary)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.notes || '—'}</td>
                            </>
                          )}
                          <td style={{ padding: '0.4rem 0.6rem', whiteSpace: 'nowrap' }}>
                            <button onClick={() => setEditingAirport(editingAirport === a._id ? null : a._id!)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 700, marginRight: '0.4rem' }}>
                              {editingAirport === a._id ? '✅ Done' : '✏️ Edit'}
                            </button>
                            <button onClick={() => handleDeleteAirport(a._id!)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.7rem', color: '#dc3545', fontWeight: 700 }}>🗑️</button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {airports.filter(a => {
                  const q = airportSearch.toLowerCase();
                  return (!q || a.name.toLowerCase().includes(q) || a.city.toLowerCase().includes(q) || a.code.toLowerCase().includes(q)) && (airportStateFilter === 'All' || a.state === airportStateFilter);
                }).length === 0 && (
                  <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', padding: '1rem' }}>No airports match your search.</p>
                )}
              </div>
            )}
          </div>

          {/* 🛫 AIRLINE REFERENCE DATABASE */}
          <div className="card" style={{ padding: '1.5rem', marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>🛫 US Airline Reference Database</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>{airlines.length} airlines — click a website to book, or add your own carrier</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setShowAddAirline(!showAddAirline)} className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>➕ Add Airline</button>
                <button onClick={() => setShowAirlineDB(!showAirlineDB)} style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', background: 'transparent', cursor: 'pointer', fontWeight: 700 }}>
                  {showAirlineDB ? '▲ Collapse' : '▼ Browse All'}
                </button>
              </div>
            </div>

            {showAddAirline && (
              <form onSubmit={handleAddAirline} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.4rem', marginBottom: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                <input placeholder="Airline Name *" value={newAirline.name || ''} onChange={e => setNewAirline({ ...newAirline, name: e.target.value })} required style={{ padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.78rem' }} />
                <input placeholder="Headquarters" value={newAirline.headquarters || ''} onChange={e => setNewAirline({ ...newAirline, headquarters: e.target.value })} style={{ padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.78rem' }} />
                <input placeholder="Website URL" value={newAirline.website || ''} onChange={e => setNewAirline({ ...newAirline, website: e.target.value })} style={{ padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.78rem' }} />
                <input placeholder="Phone Number" value={newAirline.phone || ''} onChange={e => setNewAirline({ ...newAirline, phone: e.target.value })} style={{ padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.78rem' }} />
                <input placeholder="Notes" value={newAirline.notes || ''} onChange={e => setNewAirline({ ...newAirline, notes: e.target.value })} style={{ padding: '0.35rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.78rem' }} />
                <button type="submit" className="btn btn-primary" style={{ fontSize: '0.78rem' }}>💾 Save Airline</button>
              </form>
            )}

            {showAirlineDB && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {airlines.map(al => (
                  <div key={al._id} style={{ border: '1px solid var(--neutral-gray)', borderRadius: '8px', padding: '1rem', background: 'var(--bg-primary)', position: 'relative' }}>
                    {editingAirline === al._id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <input value={al.name} onChange={e => handleUpdateAirline(al, 'name', e.target.value)} style={{ padding: '0.3rem', border: '1px solid var(--accent-primary)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }} />
                        <input value={al.headquarters} onChange={e => handleUpdateAirline(al, 'headquarters', e.target.value)} placeholder="Headquarters" style={{ padding: '0.3rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.75rem' }} />
                        <input value={al.website} onChange={e => handleUpdateAirline(al, 'website', e.target.value)} placeholder="Website" style={{ padding: '0.3rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.75rem' }} />
                        <input value={al.phone} onChange={e => handleUpdateAirline(al, 'phone', e.target.value)} placeholder="Phone" style={{ padding: '0.3rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.75rem' }} />
                        <input value={al.notes} onChange={e => handleUpdateAirline(al, 'notes', e.target.value)} placeholder="Notes" style={{ padding: '0.3rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', fontSize: '0.75rem' }} />
                        <button onClick={() => setEditingAirline(null)} style={{ padding: '0.3rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem' }}>✅ Save Changes</button>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>✈️ {al.name}</h5>
                          <div style={{ display: 'flex', gap: '0.3rem' }}>
                            <button onClick={() => setEditingAirline(al._id!)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.7rem' }}>✏️</button>
                            <button onClick={() => handleDeleteAirline(al._id!)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc3545', fontWeight: 700, fontSize: '0.7rem' }}>🗑️</button>
                          </div>
                        </div>
                        <p style={{ margin: '0 0 0.3rem', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>📍 {al.headquarters || 'N/A'}</p>
                        {al.phone && <p style={{ margin: '0 0 0.3rem', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>📞 {al.phone}</p>}
                        {al.notes && <p style={{ margin: '0 0 0.5rem', fontSize: '0.72rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>{al.notes}</p>}
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {al.website && <a href={al.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem', background: 'var(--accent-primary)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 700 }}>🌐 Book Now</a>}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 4: ITINERARY */}
      {activeTab === 'itinerary' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          
          {/* Left: day-by-day scheduler timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>📅 Day-by-Day Travel Scheduler</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Organize your time blocks. Add excitements ratings to curate an active balance of culture and radical rest.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {Array.from({ length: displayDays }, (_, i) => i + 1).map(day => {
                const dayItems = itinerary.filter(i => i.dayNumber === day);
                return (
                  <div key={day} className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--accent-primary)' }}>☀️ Day {day} Schedule</h4>
                        <button
                          type="button"
                          onClick={() => handleDeleteDay(day)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#dc2626',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.4rem',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.2rem'
                          }}
                          title={`Delete Day ${day} and shift subsequent days`}
                        >
                          🗑️ Delete Day
                        </button>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Planned Day Cost: <strong>${dayItems.reduce((acc, curr) => acc + curr.cost, 0)}</strong></span>
                    </div>

                    {dayItems.length === 0 ? (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '1rem 0' }}>No items scheduled for Day {day}. Add a block on the right or reserve an option in Research tab!</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {dayItems.map(item => (
                          <div 
                            key={item._id} 
                            style={{ 
                              background: 'var(--bg-primary)', 
                              padding: '1rem', 
                              borderRadius: '8px', 
                              border: '1px solid var(--neutral-gray)',
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '1rem',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start'
                            }}
                          >
                            <div style={{ flex: 1, minWidth: '200px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ 
                                  fontSize: '0.7rem', 
                                  background: 'rgba(111, 66, 193, 0.1)', 
                                  color: 'var(--accent-primary)', 
                                  fontWeight: 700, 
                                  padding: '0.15rem 0.4rem', 
                                  borderRadius: '4px',
                                  textTransform: 'uppercase'
                                }}>
                                  {item.timeOfDay}
                                </span>
                                <span style={{ fontSize: '0.7rem', background: 'var(--neutral-gray)', color: 'var(--text-primary)', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                                  {item.activityType === 'transit' ? '✈️ Transit' : item.activityType === 'lodging' ? '🏨 Lodging' : item.activityType === 'dining' ? '🍽️ Dining' : item.activityType === 'excursion' ? '🧗 Excursion' : item.activityType === 'rest' ? '🧘 Rest' : '🎨 Sight'}
                                </span>
                              </div>
                              <h5 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0.5rem 0 0.25rem 0' }}>{item.title}</h5>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>{item.notes}</p>
                              
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', fontSize: '0.7rem' }}>
                                {item.reservationCode && (
                                  <span>🔑 Code: <strong style={{ color: 'var(--accent-primary)' }}>{item.reservationCode}</strong></span>
                                )}
                                <span>Cost: <strong>${item.cost}</strong></span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Excitement:</span>
                                {[1, 2, 3, 4, 5].map(val => (
                                  <button
                                    key={val}
                                    onClick={() => handleUpdateItinerary(item, 'excitementRating', val)}
                                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, fontSize: '0.85rem' }}
                                  >
                                    {val <= item.excitementRating ? '❤️' : '🤍'}
                                  </button>
                                ))}
                              </div>
                              
                              <button
                                onClick={() => handleDeleteItinerary(item._id!)}
                                style={{ border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, padding: 0 }}
                              >
                                Delete Block
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setNumDays(prev => prev + 1)}
                style={{ width: '100%', padding: '0.75rem', fontWeight: 'bold', border: '1px dashed var(--neutral-gray)', background: 'var(--bg-secondary)', color: 'var(--accent-primary)', cursor: 'pointer', borderRadius: '8px' }}
              >
                ➕ Add Another Day
              </button>
            </div>
          </div>

          {/* Right: add custom itinerary block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem' }}>➕ Add Itinerary Block</h3>
              <form onSubmit={handleAddItineraryItem} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Day Number</label>
                    <select
                      value={newItineraryItem.dayNumber}
                      onChange={(e) => setNewItineraryItem({ ...newItineraryItem, dayNumber: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem', background: 'var(--bg-secondary)' }}
                    >
                      {Array.from({ length: Math.max(30, displayDays) }, (_, i) => i + 1).map(d => (
                        <option key={d} value={d}>Day {d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Time Slot</label>
                    <select
                      value={newItineraryItem.timeOfDay}
                      onChange={(e) => setNewItineraryItem({ ...newItineraryItem, timeOfDay: e.target.value })}
                      style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem', background: 'var(--bg-secondary)' }}
                    >
                      <option value="Morning">🌅 Morning</option>
                      <option value="Afternoon">☀️ Afternoon</option>
                      <option value="Evening">🌌 Evening</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Activity Type</label>
                  <select
                    value={newItineraryItem.activityType}
                    onChange={(e) => setNewItineraryItem({ ...newItineraryItem, activityType: e.target.value as any })}
                    style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem', background: 'var(--bg-secondary)' }}
                  >
                    <option value="transit">✈️ Transit</option>
                    <option value="lodging">🏨 Lodging</option>
                    <option value="dining">🍽️ Dining</option>
                    <option value="excursion">🧗 Excursion</option>
                    <option value="rest">🧘 Rest & Sleep</option>
                    <option value="sights">🎨 Sights & Sights</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Activity Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Bamboo boat ride"
                    value={newItineraryItem.title}
                    onChange={(e) => setNewItineraryItem({ ...newItineraryItem, title: e.target.value })}
                    style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Cost ($)</label>
                    <input
                      type="number"
                      value={newItineraryItem.cost || ''}
                      onChange={(e) => setNewItineraryItem({ ...newItineraryItem, cost: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Reservation Code</label>
                    <input
                      type="text"
                      placeholder="Optional"
                      value={newItineraryItem.reservationCode}
                      onChange={(e) => setNewItineraryItem({ ...newItineraryItem, reservationCode: e.target.value })}
                      style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Notes & Reminders</label>
                  <textarea
                    rows={2}
                    value={newItineraryItem.notes}
                    onChange={(e) => setNewItineraryItem({ ...newItineraryItem, notes: e.target.value })}
                    placeholder="e.g. Gather at main bridge. Dress warm."
                    style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem', resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}>
                  📅 Schedule Itinerary Item
                </button>
              </form>
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: BUDGET */}
      {activeTab === 'budget' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Top Dynamic Summaries Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-primary)' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Total Allocated (Budget)</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem' }}>${totalEstimated.toLocaleString()}</div>
            </div>
            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #28a745' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Registry Guest Gifting</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#28a745', marginTop: '0.25rem' }}>${totalRegistryGifts.toLocaleString()}</div>
            </div>
            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #fd7e14' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Out of Pocket Couple Cost</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fd7e14', marginTop: '0.25rem' }}>${netPocketCost.toLocaleString()}</div>
            </div>
            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #17a2b8' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Actual Spent to Date</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#17a2b8', marginTop: '0.25rem' }}>${totalActual.toLocaleString()}</div>
            </div>
          </div>

          {/* Main Workspace Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '2rem' }}>
            
            {/* Left: Spreadsheet Row Ledger */}
            <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>💰 Interactive Spreadsheet Ledger</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Double click or edit fields below. Watch totals updates instantly. Red warning badges flag overspent fields.
              </p>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--neutral-gray)', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 800 }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Category</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Expense Item</th>
                    <th style={{ padding: '0.75rem 0.5rem', width: '100px' }}>Est. Cost</th>
                    <th style={{ padding: '0.75rem 0.5rem', width: '100px' }}>Actual Spent</th>
                    <th style={{ padding: '0.75rem 0.5rem', width: '220px' }}>Registry Gifting Logs</th>
                    <th style={{ padding: '0.75rem 0.5rem', width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(e => {
                    const isOverspent = e.actual > e.estimated;
                    const giftingPct = Math.min(100, Math.round(((e.contribution || 0) / (e.estimated || 1)) * 100));
                    return (
                      <tr key={e._id} style={{ borderBottom: '1px solid var(--neutral-gray)', background: isOverspent ? 'rgba(220,53,69,0.01)' : 'transparent' }}>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span style={{ fontSize: '0.7rem', background: 'rgba(111,66,193,0.08)', color: 'var(--accent-primary)', fontWeight: 700, padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                            {e.category}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>{e.name}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>$</span>
                            <input
                              type="number"
                              value={e.estimated}
                              onChange={(val) => handleUpdateExpense(e, 'estimated', Number(val.target.value))}
                              style={{ width: '80px', padding: '0.25rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)', fontSize: '0.8rem' }}
                            />
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>$</span>
                            <input
                              type="number"
                              value={e.actual}
                              onChange={(val) => handleUpdateExpense(e, 'actual', Number(val.target.value))}
                              style={{ width: '80px', padding: '0.25rem', border: isOverspent ? '1px solid #dc3545' : '1px solid var(--neutral-gray)', borderRadius: '4px', background: isOverspent ? 'rgba(220,53,69,0.02)' : 'var(--bg-primary)', color: isOverspent ? '#dc3545' : 'inherit', fontSize: '0.8rem' }}
                            />
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Gifted: <strong>${e.contribution || 0}</strong> {e.contributor ? `(by ${e.contributor})` : ''}</span>
                              <span style={{ fontWeight: 700 }}>{giftingPct}%</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: 'var(--neutral-gray)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${giftingPct}%`, height: '100%', background: '#28a745' }}></div>
                            </div>
                            
                            {/* Tiny log edit widget */}
                            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                              <input
                                type="text"
                                placeholder="Giver"
                                value={e.contributor || ''}
                                onChange={(val) => handleUpdateExpense(e, 'contributor', val.target.value)}
                                style={{ flex: 1, padding: '0.15rem 0.25rem', fontSize: '0.65rem', border: '1px solid var(--neutral-gray)', borderRadius: '3px' }}
                              />
                              <input
                                type="number"
                                placeholder="Amt ($)"
                                value={e.contribution || ''}
                                onChange={(val) => handleUpdateExpense(e, 'contribution', Number(val.target.value))}
                                style={{ width: '60px', padding: '0.15rem 0.25rem', fontSize: '0.65rem', border: '1px solid var(--neutral-gray)', borderRadius: '3px' }}
                              />
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                          <button onClick={() => handleDeleteExpense(e._id!)} style={{ border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer', fontSize: '0.95rem' }}>🗑️</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Right: Currency Converter Widget & Addition card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Add Custom Expense */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>➕ Add Expense Row</h3>
                <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Category Dropdown</label>
                    <select
                      value={newExpenseItem.category}
                      onChange={(e) => setNewExpenseItem({ ...newExpenseItem, category: e.target.value })}
                      style={{ width: '100%', padding: '0.45rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem', background: 'var(--bg-secondary)' }}
                    >
                      {settings.customCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Expense Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Traditional dinner booking"
                      value={newExpenseItem.name}
                      onChange={(e) => setNewExpenseItem({ ...newExpenseItem, name: e.target.value })}
                      style={{ width: '100%', padding: '0.45rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Estimated Budget Cost ($)</label>
                    <input
                      type="number"
                      value={newExpenseItem.estimated || ''}
                      onChange={(e) => setNewExpenseItem({ ...newExpenseItem, estimated: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.45rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem' }}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}>
                    💰 Save Budget Expense
                  </button>
                </form>
              </div>

              {/* Currency Converter Widget */}
              <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  💱 Currency Converter Tool
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Input local prices abroad and calculate base equivalence in real time.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Foreign Currency</label>
                      <select
                        value={convertFrom}
                        onChange={(e) => {
                          setConvertFrom(e.target.value);
                          // Seed approximate mock rates
                          const r = e.target.value === 'EUR' ? 1.09 : e.target.value === 'GBP' ? 1.27 : e.target.value === 'JPY' ? 0.0064 : e.target.value === 'CAD' ? 0.73 : 0.66;
                          setExchangeRate(r);
                        }}
                        style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', background: 'var(--bg-secondary)', fontSize: '0.8rem' }}
                      >
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                        <option value="CAD">CAD (C$)</option>
                        <option value="AUD">AUD (A$)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Amount</label>
                      <input
                        type="number"
                        value={convertAmount}
                        onChange={(e) => setConvertAmount(Number(e.target.value))}
                        style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Conversion Rate (Customizable)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={exchangeRate}
                      onChange={(e) => setExchangeRate(Number(e.target.value))}
                      style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div style={{ background: 'white', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--neutral-gray)', textAlign: 'center', marginTop: '0.5rem' }}>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Equivalence</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                      ${(convertAmount * exchangeRate).toFixed(2)} {settings.baseCurrency}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const computedVal = (convertAmount * exchangeRate);
                      setNewExpenseItem({
                        ...newExpenseItem,
                        estimated: Number(computedVal.toFixed(2)),
                        name: `${convertAmount} ${convertFrom} Local item conversion`
                      });
                      alert(`📋 Done! Copied $${computedVal.toFixed(2)} to estimated cost input above. Press "Save Budget Expense" to append.`);
                    }}
                    className="btn btn-secondary"
                    style={{ width: '100%', fontSize: '0.75rem', padding: '0.4rem' }}
                  >
                    📋 Copy Equivalence to Addition Form
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 6: CHECKLIST */}
      {activeTab === 'checklist' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '2rem' }}>
          
          {/* Left: countdown timeline list */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>⏳ Milestone Countdown Checklist</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700 }}>
                <span>Milestone progress:</span>
                <span style={{ background: 'var(--accent-secondary)', color: 'var(--accent-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  {taskProgressPct}% Complete
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {['6+ months out', '3 months out', '2 months out', '1 month out', '1 week out', '48 hours out', 'Day-of'].map(section => {
                const sectionTasks = tasks.filter(t => t.timeline === section);
                return (
                  <div key={section} style={{ borderBottom: '1px dashed var(--neutral-gray)', paddingBottom: '1.25rem' }}>
                    <h4 style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                      📅 {section}
                    </h4>

                    {sectionTasks.length === 0 ? (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No checklist items logged for this phase.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {sectionTasks.map(t => (
                          <div key={t._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', flex: 1 }}>
                              <input
                                type="checkbox"
                                checked={t.completed}
                                onChange={() => handleToggleTask(t)}
                                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                              />
                              <span style={{ textDecoration: t.completed ? 'line-through' : 'none', color: t.completed ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: t.completed ? 400 : 600 }}>
                                {t.text}
                              </span>
                            </label>
                            <button 
                              onClick={() => handleDeleteTask(t._id!)}
                              style={{ border: 'none', background: 'transparent', color: '#b91c1c', cursor: 'pointer', fontSize: '0.75rem', opacity: 0.6 }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: add custom tasks */}
          <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>➕ Add Checklist Milestone</h3>
            <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Timeline Countdown Phase</label>
                <select
                  value={newTaskTimeline}
                  onChange={(e) => setNewTaskTimeline(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem', background: 'var(--bg-secondary)' }}
                >
                  <option value="6+ months out">⏳ 6+ months out</option>
                  <option value="3 months out">⏳ 3 months out</option>
                  <option value="2 months out">⏳ 2 months out</option>
                  <option value="1 month out">⏳ 1 month out</option>
                  <option value="1 week out">⏳ 1 week out</option>
                  <option value="48 hours out">⏳ 48 hours out</option>
                  <option value="Day-of">⏳ Day-of</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Task Details</label>
                <input
                  type="text"
                  placeholder="e.g. Print physical booking confirmations"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem' }}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}>
                ➕ Save Milestone Task
              </button>
            </form>
          </div>

        </div>
      )}

      {/* TAB 7: PACKING LIST */}
      {activeTab === 'packing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>🎒 Dual Suitcase Packing Lists</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Pack together but separately! Taylor & Alex get their own suitcase checklists to prevent double-packing and monitor progress charts.
            </p>
          </div>

          {/* Core split Suitcases columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            
            {/* Suitcase Column A (partnerA) */}
            <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid var(--accent-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>💼 {settings.partnerA}'s Suitcase</h4>
                <span style={{ fontSize: '0.75rem', background: 'rgba(111,66,193,0.1)', color: 'var(--accent-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                  {partnerAPackingProgress}% Packed
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto', marginBottom: '1.5rem' }}>
                {['clothing', 'toiletries', 'electronics', 'documents', 'romantic'].map(cat => {
                  const catItems = partnerAPacking.filter(p => p.category === cat);
                  return (
                    <div key={cat} style={{ marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                        {cat === 'clothing' ? '👕 Clothing' : cat === 'toiletries' ? '🧴 Toiletries' : cat === 'electronics' ? '🔌 Electronics' : cat === 'documents' ? '📄 Documents' : '💖 Romantic surprises'}
                      </span>
                      {catItems.length === 0 ? (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Empty</span>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingLeft: '0.5rem' }}>
                          {catItems.map(item => (
                            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer', flex: 1 }}>
                                <input
                                  type="checkbox"
                                  checked={item.packed}
                                  onChange={() => handleTogglePackingItem(item)}
                                  style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                                />
                                <span style={{ textDecoration: item.packed ? 'line-through' : 'none', color: item.packed ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                                  {item.itemName}
                                </span>
                              </label>
                              <button onClick={() => handleDeletePackingItem(item._id!)} style={{ border: 'none', background: 'transparent', color: '#b91c1c', cursor: 'pointer', fontSize: '0.7rem', opacity: 0.5 }}>✕</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Suitcase Column B (partnerB) */}
            <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid #e83e8c' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>💼 {settings.partnerB}'s Suitcase</h4>
                <span style={{ fontSize: '0.75rem', background: 'rgba(232, 62, 140, 0.1)', color: '#e83e8c', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                  {partnerBPackingProgress}% Packed
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto', marginBottom: '1.5rem' }}>
                {['clothing', 'toiletries', 'electronics', 'documents', 'romantic'].map(cat => {
                  const catItems = partnerBPacking.filter(p => p.category === cat);
                  return (
                    <div key={cat} style={{ marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                        {cat === 'clothing' ? '👕 Clothing' : cat === 'toiletries' ? '🧴 Toiletries' : cat === 'electronics' ? '🔌 Electronics' : cat === 'documents' ? '📄 Documents' : '💖 Romantic surprises'}
                      </span>
                      {catItems.length === 0 ? (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Empty</span>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingLeft: '0.5rem' }}>
                          {catItems.map(item => (
                            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer', flex: 1 }}>
                                <input
                                  type="checkbox"
                                  checked={item.packed}
                                  onChange={() => handleTogglePackingItem(item)}
                                  style={{ accentColor: '#e83e8c', cursor: 'pointer' }}
                                />
                                <span style={{ textDecoration: item.packed ? 'line-through' : 'none', color: item.packed ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                                  {item.itemName}
                                </span>
                              </label>
                              <button onClick={() => handleDeletePackingItem(item._id!)} style={{ border: 'none', background: 'transparent', color: '#b91c1c', cursor: 'pointer', fontSize: '0.7rem', opacity: 0.5 }}>✕</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Quick addition packer form */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem' }}>➕ Add Item to Traveler suitcase</h4>
            <form onSubmit={handleAddPackingItem} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <select
                value={newPackingItem.traveler}
                onChange={(e) => setNewPackingItem({ ...newPackingItem, traveler: e.target.value as any })}
                style={{ padding: '0.45rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem', background: 'var(--bg-secondary)' }}
              >
                <option value="partnerA">👤 {settings.partnerA}'s Suitcase</option>
                <option value="partnerB">👤 {settings.partnerB}'s Suitcase</option>
              </select>
              <select
                value={newPackingItem.category}
                onChange={(e) => setNewPackingItem({ ...newPackingItem, category: e.target.value as any })}
                style={{ padding: '0.45rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem', background: 'var(--bg-secondary)' }}
              >
                <option value="clothing">👕 Clothing</option>
                <option value="toiletries">🧴 Toiletries</option>
                <option value="electronics">🔌 Electronics</option>
                <option value="documents">📄 Documents</option>
                <option value="romantic">💖 Romantic surprises</option>
              </select>
              <input
                type="text"
                placeholder="e.g. Universal travel adapters"
                value={newPackingItem.itemName || ''}
                onChange={(e) => setNewPackingItem({ ...newPackingItem, itemName: e.target.value })}
                style={{ flex: 1, minWidth: '180px', padding: '0.45rem', border: '1px solid var(--neutral-gray)', borderRadius: '6px', fontSize: '0.8rem' }}
                required
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.45rem 1.25rem', fontSize: '0.8rem' }}>Pack Item</button>
            </form>
          </div>


        </div>
      )}

      {/* TAB 8: TRIP OVERVIEW MASTER DASHBOARD */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Executive wow summary header */}
          <div className="card" style={{ padding: '2rem', background: 'linear-gradient(135deg, #1A1D20 0%, #343a40 100%)', color: 'white', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
            <div>
              <span style={{ background: '#28a745', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Selected Escape Locked In</span>
              <h2 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-family)', fontWeight: 800, marginTop: '0.5rem', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>📍 {settings.destination}</h2>
              <p style={{ opacity: 0.7, fontSize: '0.85rem' }}>Trip Departure: <strong>{settings.startDate || 'TBD'}</strong> | Return: <strong>{settings.endDate || 'TBD'}</strong></p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.06)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '2rem' }}>✈️</span>
              <div>
                <span style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.6, fontWeight: 700 }}>Countdown Clock</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-secondary)' }}>{daysRemaining} Days To Go</span>
              </div>
            </div>
          </div>

          {/* Master Rings dashboard */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            {/* Budget allocation breakdown */}
            <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>💰 Financial Budget Splits</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <span>Actual Spent vs Estimated:</span>
                  <strong>${totalActual} / ${totalEstimated}</strong>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--neutral-gray)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                  <div style={{ width: `${Math.min(100, Math.round((totalActual / (totalEstimated || 1)) * 100))}%`, height: '100%', background: 'var(--accent-primary)' }}></div>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Out of Pocket Couple Cost: <strong style={{ color: 'var(--text-primary)' }}>${netPocketCost}</strong> (Registry covered remainder)
              </div>
            </div>

            {/* Checklist progress ring */}
            <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>⏳ Milestones countdown checklist</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <span>Checklist Completion:</span>
                  <strong>{completedTasksCount} / {tasks.length} Done</strong>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--neutral-gray)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                  <div style={{ width: `${taskProgressPct}%`, height: '100%', background: '#fd7e14' }}></div>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Milestone Percentage: <strong>{taskProgressPct}% Complete</strong>
              </div>
            </div>

            {/* Dual Suitcases packing progress */}
            <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>🎒 Suitcases Packing Stats</h4>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                  <span>👤 {settings.partnerA}:</span>
                  <strong>{partnerAPackingProgress}%</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--neutral-gray)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${partnerAPackingProgress}%`, height: '100%', background: 'var(--accent-primary)' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                  <span>👤 {settings.partnerB}:</span>
                  <strong>{partnerBPackingProgress}%</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--neutral-gray)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${partnerBPackingProgress}%`, height: '100%', background: '#e83e8c' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Schedule Preview */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem' }}>📅 Day 1 & Day 2 Travel Schedule Coming Up</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {itinerary.filter(i => i.dayNumber === 1 || i.dayNumber === 2).slice(0, 3).map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--neutral-gray)', fontSize: '0.825rem' }}>
                  <div>
                    <span style={{ fontWeight: 800, color: 'var(--accent-primary)', marginRight: '0.5rem' }}>Day {item.dayNumber} {item.timeOfDay}</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{item.title}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '1rem' }}>{item.notes}</span>
                  </div>
                  {item.reservationCode && (
                    <span style={{ fontSize: '0.75rem', background: 'var(--accent-secondary)', color: 'var(--accent-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                      🔑 {item.reservationCode}
                    </span>
                  )}
                </div>
              ))}
              {itinerary.filter(i => i.dayNumber === 1 || i.dayNumber === 2).length === 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No itinerary blocks scheduled yet. Pop over to Itinerary tab to schedule some events!</p>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
