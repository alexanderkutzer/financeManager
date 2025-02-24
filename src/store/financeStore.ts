import { create } from 'zustand';
import { Transaction, Budget, SavingsGoal } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Sample data for initial display
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    user_id: '1',
    amount: 3000,
    type: 'income',
    category: 'Salary',
    description: 'Monthly salary',
    date: '2024-02-01',
    created_at: '2024-02-01T00:00:00Z'
  },
  {
    id: '2',
    user_id: '1',
    amount: 500,
    type: 'expense',
    category: 'Rent',
    description: 'Monthly rent',
    date: '2024-02-02',
    created_at: '2024-02-02T00:00:00Z'
  },
  {
    id: '3',
    user_id: '1',
    amount: 100,
    type: 'expense',
    category: 'Groceries',
    description: 'Weekly groceries',
    date: '2024-02-03',
    created_at: '2024-02-03T00:00:00Z'
  }
];

const sampleBudgets: Budget[] = [
  {
    id: '1',
    user_id: '1',
    category: 'Food',
    amount: 400,
    period: 'monthly',
    created_at: '2024-02-01T00:00:00Z'
  },
  {
    id: '2',
    user_id: '1',
    category: 'Entertainment',
    amount: 200,
    period: 'monthly',
    created_at: '2024-02-01T00:00:00Z'
  }
];

const sampleSavingsGoals: SavingsGoal[] = [
  {
    id: '1',
    user_id: '1',
    name: 'Emergency Fund',
    target_amount: 10000,
    current_amount: 2000,
    target_date: '2024-12-31',
    created_at: '2024-02-01T00:00:00Z'
  },
  {
    id: '2',
    user_id: '1',
    name: 'Vacation',
    target_amount: 5000,
    current_amount: 1000,
    target_date: '2024-08-31',
    created_at: '2024-02-01T00:00:00Z'
  }
];

interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  isLoading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  fetchBudgets: () => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  fetchSavingsGoals: () => Promise<void>;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: sampleTransactions,
  budgets: sampleBudgets,
  savingsGoals: sampleSavingsGoals,
  isLoading: false,
  error: null,

  fetchTransactions: async () => {
    if (!isSupabaseConfigured()) {
      console.log('Using sample transactions data');
      return;
    }

    set({ isLoading: true });
    try {
      const { data, error } = await supabase!
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      set({ transactions: data || sampleTransactions, error: null });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addTransaction: async (transaction) => {
    if (!isSupabaseConfigured()) {
      // For demo mode, add to local state with a fake ID
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        user_id: '1',
        created_at: new Date().toISOString(),
        ...transaction
      };
      
      set(state => ({
        transactions: [newTransaction, ...state.transactions]
      }));
      return;
    }

    set({ isLoading: true });
    try {
      const { data, error } = await supabase!
        .from('transactions')
        .insert([transaction])
        .select();

      if (error) throw error;
      
      // Refresh transactions after adding new one
      await get().fetchTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBudgets: async () => {
    if (!isSupabaseConfigured()) {
      console.log('Using sample budgets data');
      return;
    }

    set({ isLoading: true });
    try {
      const { data, error } = await supabase!
        .from('budgets')
        .select('*');

      if (error) throw error;
      set({ budgets: data || sampleBudgets, error: null });
    } catch (error) {
      console.error('Error fetching budgets:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addBudget: async (budget) => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, cannot add budget');
      return;
    }

    set({ isLoading: true });
    try {
      const { data, error } = await supabase!
        .from('budgets')
        .insert([budget])
        .select();

      if (error) throw error;
      set((state) => ({
        budgets: [...state.budgets, data[0]],
        error: null,
      }));
    } catch (error) {
      console.error('Error adding budget:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSavingsGoals: async () => {
    if (!isSupabaseConfigured()) {
      console.log('Using sample savings goals data');
      return;
    }

    set({ isLoading: true });
    try {
      const { data, error } = await supabase!
        .from('savings_goals')
        .select('*');

      if (error) throw error;
      set({ savingsGoals: data || sampleSavingsGoals, error: null });
    } catch (error) {
      console.error('Error fetching savings goals:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addSavingsGoal: async (goal) => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, cannot add savings goal');
      return;
    }

    set({ isLoading: true });
    try {
      const { data, error } = await supabase!
        .from('savings_goals')
        .insert([goal])
        .select();

      if (error) throw error;
      set((state) => ({
        savingsGoals: [...state.savingsGoals, data[0]],
        error: null,
      }));
    } catch (error) {
      console.error('Error adding savings goal:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));