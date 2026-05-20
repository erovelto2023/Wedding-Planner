export type TravelStyle = 'beach' | 'adventure' | 'cultural' | 'romantic' | 'mixed';
export type TaskCategory = 'logistics' | 'booking' | 'finance' | 'health' | 'romance' | 'prep';
export type ReminderChannel = 'push' | 'email' | 'in_app';
export type ReminderStatus = 'pending' | 'sent' | 'dismissed';

export interface HoneymoonPlan {
  id: string;
  userId: string;
  destination: string;
  startDate: string; // ISO string YYYY-MM-DD
  endDate: string;   // ISO string YYYY-MM-DD
  budgetTotal: number;
  budgetRemaining: number;
  travelStyle: TravelStyle;
  partnerEmail?: string;
  createdAt: string;
}

export interface PlannerPhase {
  id: string;
  planId: string;
  name: string;
  order: number;
  description: string;
  isActive: boolean;
}

export interface Task {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  category: TaskCategory;
  dueDate: string; // ISO string
  isCompleted: boolean;
  notes: string;
  attachments: string[];
}

export interface BudgetItem {
  id: string;
  planId: string;
  category: string;
  allocated: number;
  spent: number;
  isPaid: boolean;
}

export interface Reminder {
  id: string;
  taskId: string;
  triggerDate: string;
  channel: ReminderChannel;
  status: ReminderStatus;
}
