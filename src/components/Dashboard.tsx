import React, { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Wallet, Target, PiggyBank } from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';
import { AddTransactionForm } from './AddTransactionForm';

export function Dashboard() {
  const { 
    transactions, 
    budgets, 
    savingsGoals, 
    fetchTransactions, 
    fetchBudgets, 
    fetchSavingsGoals 
  } = useFinanceStore();

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
    fetchSavingsGoals();
  }, [fetchTransactions, fetchBudgets, fetchSavingsGoals]);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const chartData = transactions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(t => ({
      date: format(new Date(t.date), 'dd.MM.yy'),
      amount: t.type === 'income' ? t.amount : -t.amount
    }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Finanzen Dashboard</h1>
      </div>
      
      <AddTransactionForm />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <Wallet className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-gray-600">Aktueller Kontostand</p>
              <p className="text-2xl font-bold">{balance.toFixed(2)} €</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <Target className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-gray-600">Aktive Budgets</p>
              <p className="text-2xl font-bold">{budgets.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <PiggyBank className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-gray-600">Sparziele</p>
              <p className="text-2xl font-bold">{savingsGoals.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Cashflow</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} €`} />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#3b82f6"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Letzte Transaktionen</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Datum</th>
                <th className="text-left py-2">Beschreibung</th>
                <th className="text-left py-2">Kategorie</th>
                <th className="text-right py-2">Betrag</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map(transaction => (
                <tr key={transaction.id} className="border-b">
                  <td className="py-2">{format(new Date(transaction.date), 'dd.MM.yyyy')}</td>
                  <td className="py-2">{transaction.description}</td>
                  <td className="py-2">{transaction.category}</td>
                  <td className={`py-2 text-right ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}