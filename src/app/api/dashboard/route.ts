// Forced rebuild comment
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
    const userId = (session.user as any).id;
    
    const proposalCount = await db.collection('proposals').countDocuments({ userId });
    const leadCount = await db.collection('leads').countDocuments({ userId });
    const guestCount = await db.collection('guests').countDocuments({ userId });
    
    // Calculate real budget and expenses
    const budgetItems = await db.collection('budget').find({ userId }).toArray();
    const total = budgetItems.filter(i => !i.isSettings).reduce((acc, item) => acc + (item.estimated || 0), 0);
    
    const expenses = await db.collection('expenses').find({ userId }).toArray();
    const spent = expenses.reduce((acc, exp) => acc + (exp.amount || 0), 0);
    
    const invoices = await db.collection('invoices').find({ userId }).toArray();
    const paidRevenue = invoices.filter((inv: any) => inv.status === 'paid').reduce((acc: number, inv: any) => acc + (inv.amount || 0), 0);
    
    const activeLeads = await db.collection('leads').find({ userId, status: 'Client' }).limit(4).toArray();
    const activeProjects = activeLeads.map(l => l.name || l.coupleName || 'Unnamed Project');
    const totalProjects = await db.collection('leads').countDocuments({ userId, status: 'Client' });
    
    // Generate alerts
    const alerts = [];
    
    const overdueInvoices = invoices.filter((inv: any) => inv.status === 'pending' && inv.dueDate && inv.dueDate < new Date().toISOString());
    if (overdueInvoices.length > 0) {
      alerts.push({
        type: 'danger',
        message: `${overdueInvoices.length} invoices are overdue!`,
        project: 'Accounting'
      });
    }
    
    const pendingProposals = await db.collection('proposals').find({ userId, status: 'draft' }).toArray();
    if (pendingProposals.length > 0) {
      alerts.push({
        type: 'warning',
        message: `${pendingProposals.length} proposals are in draft.`,
        project: 'Sales'
      });
    }
    
    return NextResponse.json({
      proposals: { draft: proposalCount, sent: 0 },
      leads: { active: leadCount },
      guests: { total: guestCount },
      budget: { spent, remaining: total - spent, total },
      revenue: { paid: paidRevenue },
      projects: { active: activeProjects, total: totalProjects },
      alerts: alerts
    });
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
