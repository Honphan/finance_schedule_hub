import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '../services/api';
import { TransactionType } from '../types';
import type { Transaction } from '../types';

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Dummy data for now if API is not fully connected, 
  // but we implement the true structure.
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/transactions');
      setTransactions(data);
    } catch (err) {
      console.error('Failed to fetch transactions', err);
      // Fallback dummy data
      setTransactions([
        { id: 1, amount: 50.0, transactionDate: '2026-03-15', note: 'Groceries', category: { id: 1, name: 'Food', type: TransactionType.EXPENSE } },
        { id: 2, amount: 1200.0, transactionDate: '2026-03-01', note: 'Salary', category: { id: 2, name: 'Salary', type: TransactionType.INCOME } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Finance</h2>
        <Button>Add Transaction</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Note</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={4} className="h-24 text-center text-muted-foreground">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="border-t hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">{tx.transactionDate}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          tx.category.type === TransactionType.INCOME ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                        }`}>
                          {tx.category.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{tx.note}</td>
                      <td className={`px-4 py-3 text-right font-medium ${
                        tx.category.type === TransactionType.INCOME ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {tx.category.type === TransactionType.INCOME ? '+' : '-'}${tx.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Transaction Create Form Place Holder (would normally be in a Dialog) */}
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Quick Add Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" step="0.01" placeholder="0.00" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note">Note</Label>
              <Input id="note" type="text" placeholder="Description" />
            </div>
            <div className="grid gap-2">
               <Label htmlFor="category">Category (ID)</Label>
               <Input id="category" type="number" placeholder="Category ID" />
            </div>
            <Button type="button">Save Transaction</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
