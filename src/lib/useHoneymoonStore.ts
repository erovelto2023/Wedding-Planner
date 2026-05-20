import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HoneymoonPlan, PlannerPhase, Task, BudgetItem } from '../types/honeymoon';

interface HoneymoonState {
  plan: HoneymoonPlan | null;
  phases: PlannerPhase[];
  tasks: Task[];
  budgetItems: BudgetItem[];
  
  // Core Actions
  initializePlan: (data: Omit<HoneymoonPlan, 'id' | 'budgetRemaining' | 'createdAt'>) => void;
  toggleTask: (taskId: string) => void;
  updateTaskNotes: (taskId: string, notes: string) => void;
  addBudgetItem: (item: Omit<BudgetItem, 'id' | 'planId' | 'spent' | 'isPaid'>) => void;
  updateBudgetSpend: (itemId: string, spent: number, isPaid: boolean) => void;
  resetPlan: () => void;
}

export const useHoneymoonStore = create<HoneymoonState>()(
  persist(
    (set, get) => ({
      plan: null,
      phases: [],
      tasks: [],
      budgetItems: [],

      initializePlan: (data) => {
        const planId = 'plan_' + Math.random().toString(36).substr(2, 9);
        
        const newPlan: HoneymoonPlan = {
          ...data,
          id: planId,
          budgetRemaining: data.budgetTotal,
          createdAt: new Date().toISOString(),
        };

        // 1. Generate Standard Blueprint Phases
        const generatedPhases: PlannerPhase[] = [
          { id: `${planId}_p1`, planId, name: 'Dreaming & Budgeting', order: 1, description: 'Establish basic baseline preferences.', isActive: true },
          { id: `${planId}_p2`, planId, name: 'Bookings & Flights', order: 2, description: 'Secure travel tickets and reservations.', isActive: false },
          { id: `${planId}_p3`, planId, name: 'Final Preparation', order: 3, description: 'Final countdown, visa documents, and packing.', isActive: false },
        ];

        // 2. Auto-Scheduling Engine Core Math
        const tripStart = new Date(data.startDate);
        
        const createOffsetDate = (daysBefore: number): string => {
          const d = new Date(tripStart.getTime());
          d.setDate(d.getDate() - daysBefore);
          return d.toISOString().split('T')[0];
        };

        const generatedTasks: Task[] = [
          {
            id: 't1',
            phaseId: `${planId}_p1`,
            title: 'Define Target Destination Budget Split',
            description: 'Determine exact limits across travel lodging vs dining.',
            category: 'finance',
            dueDate: createOffsetDate(240),
            isCompleted: false,
            notes: '',
            attachments: []
          },
          {
            id: 't2',
            phaseId: `${planId}_p2`,
            title: 'Book Main International Flights',
            description: 'Airlines open seats roughly 330 days out. Aim for optimal pricing windows.',
            category: 'booking',
            dueDate: createOffsetDate(180),
            isCompleted: false,
            notes: '',
            attachments: []
          },
          {
            id: 't3',
            phaseId: `${planId}_p3`,
            title: 'Verify Passport Expiration Windows',
            description: 'Ensure passports are valid for at least 6 months past your return date.',
            category: 'logistics',
            dueDate: createOffsetDate(120),
            isCompleted: false,
            notes: '',
            attachments: []
          },
          {
            id: 't4',
            phaseId: `${planId}_p3`,
            title: 'Pack Luggage & Verify Electronics Adapters',
            description: 'Review voltage differences and assemble essentials.',
            category: 'prep',
            dueDate: createOffsetDate(7),
            isCompleted: false,
            notes: '',
            attachments: []
          }
        ];

        // 3. Initialize Base Core Budget Trackers
        const defaultBudgets: BudgetItem[] = [
          { id: 'b1', planId, category: 'Flights', allocated: data.budgetTotal * 0.35, spent: 0, isPaid: false },
          { id: 'b2', planId, category: 'Resorts & Hotels', allocated: data.budgetTotal * 0.45, spent: 0, isPaid: false },
          { id: 'b3', planId, category: 'Excursions & Food', allocated: data.budgetTotal * 0.20, spent: 0, isPaid: false },
        ];

        set({
          plan: newPlan,
          phases: generatedPhases,
          tasks: generatedTasks,
          budgetItems: defaultBudgets
        });
      },

      toggleTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
          ),
        }));
      },

      updateTaskNotes: (taskId, notes) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, notes } : t)),
        }));
      },

      addBudgetItem: (item) => {
        const { plan, budgetItems } = get();
        if (!plan) return;

        const newItem: BudgetItem = {
          ...item,
          id: 'b_' + Math.random().toString(36).substr(2, 9),
          planId: plan.id,
          spent: 0,
          isPaid: false,
        };

        const updatedItems = [...budgetItems, newItem];
        const totalSpent = updatedItems.reduce((acc, curr) => acc + curr.spent, 0);

        set({
          budgetItems: updatedItems,
          plan: { ...plan, budgetRemaining: plan.budgetTotal - totalSpent },
        });
      },

      updateBudgetSpend: (itemId, spent, isPaid) => {
        const { plan, budgetItems } = get();
        if (!plan) return;

        const updatedItems = budgetItems.map((item) =>
          item.id === itemId ? { ...item, spent, isPaid } : item
        );
        const totalSpent = updatedItems.reduce((acc, curr) => acc + curr.spent, 0);

        set({
          budgetItems: updatedItems,
          plan: { ...plan, budgetRemaining: plan.budgetTotal - totalSpent },
        });
      },

      resetPlan: () => set({ plan: null, phases: [], tasks: [], budgetItems: [] }),
    }),
    {
      name: 'honeymoon-planner-storage',
    }
  )
);
