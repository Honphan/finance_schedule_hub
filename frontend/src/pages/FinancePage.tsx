import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '../services/api';
import { TransactionType } from '../types';
import type { Transaction } from '../types';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 5;

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [formAmount, setFormAmount] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formNote, setFormNote] = useState('');
  const [formCategoryName, setFormCategoryName] = useState('');
  const [formType, setFormType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [formSaving, setFormSaving] = useState(false);

  // Search, filter, pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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
      setTransactions([
        { id: 1, amount: 50.0, transactionDate: '2026-03-15', note: 'Groceries', category: { id: 1, name: 'Food', type: TransactionType.EXPENSE } },
        { id: 2, amount: 1200.0, transactionDate: '2026-03-01', note: 'Salary', category: { id: 2, name: 'Salary', type: TransactionType.INCOME } },
        { id: 3, amount: 30.0, transactionDate: '2026-03-10', note: 'Coffee', category: { id: 3, name: 'Drinks', type: TransactionType.EXPENSE } },
        { id: 4, amount: 200.0, transactionDate: '2026-03-05', note: 'Freelance work', category: { id: 4, name: 'Freelance', type: TransactionType.INCOME } },
        { id: 5, amount: 15.0, transactionDate: '2026-03-12', note: 'Bus ticket', category: { id: 5, name: 'Transport', type: TransactionType.EXPENSE } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Unique category names for filter dropdown
  const categoryNames = useMemo(() => {
    const names = new Set(transactions.map(tx => tx.category.name));
    return Array.from(names).sort();
  }, [transactions]);

  // Filtered & searched transactions
  const filteredTransactions = useMemo(() => {
    let result = transactions;
    if (filterType !== 'ALL') {
      result = result.filter(tx => tx.category.type === filterType);
    }
    if (filterCategory !== 'ALL') {
      result = result.filter(tx => tx.category.name === filterCategory);
    }
    if (filterDateFrom) {
      result = result.filter(tx => tx.transactionDate >= filterDateFrom);
    }
    if (filterDateTo) {
      result = result.filter(tx => tx.transactionDate <= filterDateTo);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(tx =>
        tx.note.toLowerCase().includes(q) ||
        tx.category.name.toLowerCase().includes(q)
      );
    }
    return result;
  }, [transactions, filterType, filterCategory, filterDateFrom, filterDateTo, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE));
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, filterCategory, filterDateFrom, filterDateTo]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterType('ALL');
    setFilterCategory('ALL');
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  const hasActiveFilters = searchQuery || filterType !== 'ALL' || filterCategory !== 'ALL' || filterDateFrom || filterDateTo;

  const resetForm = () => {
    setFormAmount('');
    setFormDate('');
    setFormNote('');
    setFormCategoryName('');
    setFormType(TransactionType.EXPENSE);
  };

  const handleSaveTransaction = async () => {
    if (!formAmount || !formDate || !formCategoryName) {
      toast.error('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    setFormSaving(true);
    try {
      await api.post('/transactions', {
        amount: parseFloat(formAmount),
        transactionDate: formDate,
        note: formNote,
        categoryId: 1, // In real app, this maps to a real category ID
      });
      toast.success('Transaction added successfully!');
      fetchTransactions();
    } catch {
      // Fallback: add locally
      const newTx: Transaction = {
        id: Date.now(),
        amount: parseFloat(formAmount),
        transactionDate: formDate,
        note: formNote,
        category: { id: Date.now(), name: formCategoryName, type: formType },
      };
      setTransactions(prev => [newTx, ...prev]);
      toast.success('Transaction added (locally)!');
    } finally {
      setFormSaving(false);
      setDialogOpen(false);
      resetForm();
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Finance</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Transaction</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
              <DialogDescription>
                Fill in the details for your new transaction.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dialog-amount">Amount</Label>
                  <Input
                    id="dialog-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dialog-date">Date</Label>
                  <Input
                    id="dialog-date"
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dialog-note">Note</Label>
                <Input
                  id="dialog-note"
                  type="text"
                  placeholder="Description"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dialog-category">Category</Label>
                  <Input
                    id="dialog-category"
                    type="text"
                    placeholder="e.g. Food, Salary"
                    value={formCategoryName}
                    onChange={(e) => setFormCategoryName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select value={formType} onValueChange={(v) => setFormType(v as TransactionType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TransactionType.EXPENSE}>Expense</SelectItem>
                      <SelectItem value={TransactionType.INCOME}>Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveTransaction} disabled={formSaving}>
                {formSaving ? 'Saving...' : 'Save Transaction'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="Search by note or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sm:max-w-xs"
              />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="sm:w-[160px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value={TransactionType.INCOME}>Income</SelectItem>
                  <SelectItem value={TransactionType.EXPENSE}>Expense</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  {categoryNames.map(name => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex gap-2 items-center">
                <Label className="text-xs text-muted-foreground whitespace-nowrap">From</Label>
                <Input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-[160px]"
                />
              </div>
              <div className="flex gap-2 items-center">
                <Label className="text-xs text-muted-foreground whitespace-nowrap">To</Label>
                <Input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="w-[160px]"
                />
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs text-muted-foreground">
                  Clear filters
                </Button>
              )}
            </div>
          </div>

          {/* Table */}
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
                {paginatedTransactions.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={4} className="h-24 text-center text-muted-foreground">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  paginatedTransactions.map((tx) => (
                    <tr key={tx.id} className="border-t hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">{tx.transactionDate}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${tx.category.type === TransactionType.INCOME ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                          }`}>
                          {tx.category.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{tx.note}</td>
                      <td className={`px-4 py-3 text-right font-medium ${tx.category.type === TransactionType.INCOME ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}>
                        {tx.category.type === TransactionType.INCOME ? '+' : '-'}${tx.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTransactions.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
