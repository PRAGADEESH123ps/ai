import React, { useMemo, useState } from 'react';

type PaymentMethod = 'GPay' | 'PhonePe' | 'Cash';

type Expense = {
  id: string;
  title: string;
  category: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  note?: string;
};

const paymentMethods: PaymentMethod[] = ['GPay', 'PhonePe', 'Cash'];
const categories = ['Groceries', 'Transport', 'Bills', 'Food', 'Shopping', 'Health', 'Other'];

const initialExpenses: Expense[] = [
  {
    id: 'exp-1001',
    title: 'Monthly groceries',
    category: 'Groceries',
    amount: 2450,
    method: 'GPay',
    date: '2024-06-02',
    note: 'BigBasket order',
  },
  {
    id: 'exp-1002',
    title: 'Metro card top-up',
    category: 'Transport',
    amount: 350,
    method: 'PhonePe',
    date: '2024-06-04',
  },
  {
    id: 'exp-1003',
    title: 'Clinic visit',
    category: 'Health',
    amount: 800,
    method: 'Cash',
    date: '2024-06-06',
  },
  {
    id: 'exp-1004',
    title: 'Electricity bill',
    category: 'Bills',
    amount: 1265,
    method: 'GPay',
    date: '2024-06-08',
  },
];

const gpayImportSamples: Expense[] = [
  {
    id: 'gpay-2001',
    title: 'Cafe latte',
    category: 'Food',
    amount: 190,
    method: 'GPay',
    date: '2024-06-10',
    note: 'Auto-imported from GPay',
  },
  {
    id: 'gpay-2002',
    title: 'Ride share',
    category: 'Transport',
    amount: 420,
    method: 'GPay',
    date: '2024-06-11',
    note: 'Auto-imported from GPay',
  },
  {
    id: 'gpay-2003',
    title: 'Mobile recharge',
    category: 'Bills',
    amount: 299,
    method: 'GPay',
    date: '2024-06-12',
    note: 'Auto-imported from GPay',
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export default function App(): React.JSX.Element {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isImporting, setIsImporting] = useState(false);
  const [formState, setFormState] = useState({
    title: '',
    category: categories[0],
    amount: '',
    method: 'GPay' as PaymentMethod,
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch = expense.title.toLowerCase().includes(search.toLowerCase());
      const matchesMethod = methodFilter === 'All' || expense.method === methodFilter;
      const matchesCategory = categoryFilter === 'All' || expense.category === categoryFilter;
      return matchesSearch && matchesMethod && matchesCategory;
    });
  }, [expenses, search, methodFilter, categoryFilter]);

  const totalSpent = useMemo(
    () => filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    [filteredExpenses]
  );

  const spendingByMethod = useMemo(() => {
    return paymentMethods.map((method) => ({
      method,
      total: expenses
        .filter((expense) => expense.method === method)
        .reduce((sum, expense) => sum + expense.amount, 0),
    }));
  }, [expenses]);

  const handleFormChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddExpense = (event: React.FormEvent) => {
    event.preventDefault();
    const amountNumber = Number(formState.amount);
    if (!formState.title.trim() || Number.isNaN(amountNumber) || amountNumber <= 0) {
      return;
    }

    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      title: formState.title.trim(),
      category: formState.category,
      amount: amountNumber,
      method: formState.method,
      date: formState.date,
      note: formState.note.trim() || undefined,
    };

    setExpenses((prev) => [newExpense, ...prev]);
    setFormState((prev) => ({
      ...prev,
      title: '',
      amount: '',
      note: '',
      date: new Date().toISOString().split('T')[0],
    }));
  };

  const handleImportGpay = () => {
    if (isImporting) return;
    setIsImporting(true);
    setTimeout(() => {
      setExpenses((prev) => {
        const existingIds = new Set(prev.map((expense) => expense.id));
        const newItems = gpayImportSamples.filter((expense) => !existingIds.has(expense.id));
        return [...newItems, ...prev];
      });
      setIsImporting(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="border-b border-slate-800/80 bg-gradient-to-r from-emerald-500/10 via-slate-900/80 to-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">Personal Expense Tracker</p>
            <h1 className="mt-2 text-3xl font-semibold">All payments in one timeline</h1>
            <p className="mt-2 text-sm text-slate-300">
              Track GPay, PhonePe, and cash expenses with clear history, totals, and filters.
            </p>
          </div>
          <div className="grid w-full max-w-sm grid-cols-2 gap-3 rounded-2xl border border-emerald-500/20 bg-slate-900/70 p-4 text-sm">
            <div>
              <p className="text-xs uppercase text-slate-400">Total spent</p>
              <p className="mt-1 text-lg font-semibold text-emerald-200">{formatCurrency(totalSpent)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">Entries</p>
              <p className="mt-1 text-lg font-semibold">{filteredExpenses.length}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <div className="grid gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="text-xs uppercase text-slate-400">Search expenses</label>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title"
                className="mt-2 w-full rounded-xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-500"
              />
            </div>
            <div className="md:col-span-3">
              <div className="flex flex-col gap-3 rounded-xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase text-slate-400">Auto-import from GPay</p>
                  <p className="mt-1 text-sm text-slate-300">
                    Sync recent GPay payments and add them to your history automatically.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleImportGpay}
                  disabled={isImporting}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    isImporting
                      ? 'cursor-not-allowed bg-indigo-500/30 text-indigo-200/70'
                      : 'bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 text-white hover:opacity-90'
                  }`}
                >
                  {isImporting ? 'Syncing…' : 'Sync GPay history'}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs uppercase text-slate-400">Method</label>
              <select
                value={methodFilter}
                onChange={(event) => setMethodFilter(event.target.value as PaymentMethod | 'All')}
                className="mt-2 w-full rounded-xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 text-sm"
              >
                <option value="All">All methods</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase text-slate-400">Category</label>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 text-sm"
              >
                <option value="All">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/80 px-4 py-3">
                <p className="text-xs uppercase text-slate-400">Payment mix</p>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  {spendingByMethod.map((item) => (
                    <div key={item.method} className="rounded-lg border border-slate-800/80 bg-slate-900/70 px-3 py-2">
                      <p className="text-xs text-slate-400">{item.method}</p>
                      <p className="text-base font-semibold text-emerald-200">
                        {formatCurrency(item.total)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Payment history</h2>
              <p className="text-xs text-slate-400">Newest first</p>
            </div>
            <div className="mt-4 space-y-4">
              {filteredExpenses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-800/80 bg-slate-950/80 p-6 text-sm text-slate-400">
                  No expenses found. Add a new payment to get started.
                </div>
              ) : (
                filteredExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex flex-col gap-3 rounded-xl border border-slate-800/80 bg-slate-950/80 px-4 py-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="text-base font-semibold">{expense.title}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {expense.category} • {expense.method} • {expense.date}
                      </p>
                      {expense.note ? (
                        <p className="mt-2 text-xs text-slate-500">{expense.note}</p>
                      ) : null}
                    </div>
                    <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
                      {formatCurrency(expense.amount)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold">User registration</h2>
            <p className="mt-1 text-sm text-slate-400">
              Save your profile to keep expense history tied to your account.
            </p>
            <form className="mt-4 space-y-4">
              <div>
                <label className="text-xs uppercase text-slate-400">Full name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="mt-2 w-full rounded-xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-slate-400">Phone number</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  className="mt-2 w-full rounded-xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-slate-400">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-slate-400">Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  className="mt-2 w-full rounded-xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Create account
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold">Add new expense</h2>
            <p className="mt-1 text-sm text-slate-400">
              Log every payment from GPay, PhonePe, or cash in seconds.
            </p>
            <form onSubmit={handleAddExpense} className="mt-4 space-y-4">
              <div>
                <label className="text-xs uppercase text-slate-400">Title</label>
                <input
                  value={formState.title}
                  onChange={(event) => handleFormChange('title', event.target.value)}
                  placeholder="Eg. Grocery run"
                  className="mt-2 w-full rounded-xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-slate-400">Amount</label>
                <input
                  type="number"
                  value={formState.amount}
                  onChange={(event) => handleFormChange('amount', event.target.value)}
                  placeholder="0"
                  className="mt-2 w-full rounded-xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-slate-400">Category</label>
                <select
                  value={formState.category}
                  onChange={(event) => handleFormChange('category', event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 text-sm"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase text-slate-400">Payment method</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => handleFormChange('method', method)}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                        formState.method === method
                          ? 'border-emerald-400/70 bg-emerald-500/10 text-emerald-200'
                          : 'border-slate-800/80 bg-slate-950/80 text-slate-300 hover:border-slate-500/60'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs uppercase text-slate-400">Date</label>
                <input
                  type="date"
                  value={formState.date}
                  onChange={(event) => handleFormChange('date', event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-slate-400">Note (optional)</label>
                <textarea
                  value={formState.note}
                  onChange={(event) => handleFormChange('note', event.target.value)}
                  rows={3}
                  placeholder="Add any extra details"
                  className="mt-2 w-full rounded-xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Save expense
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              How it works
            </h3>
            <ol className="mt-4 space-y-3 text-sm text-slate-300">
              <li>
                <span className="font-semibold text-emerald-200">1. Add payments:</span> record every
                GPay, PhonePe, or cash transaction in the form above (or sync GPay history).
              </li>
              <li>
                <span className="font-semibold text-emerald-200">2. Filter quickly:</span> use
                method and category filters to match statements or budgets.
              </li>
              <li>
                <span className="font-semibold text-emerald-200">3. Review totals:</span> check the
                payment mix and total spent to stay on top of your month.
              </li>
            </ol>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Tips
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>Capture cash payments instantly to keep totals accurate.</li>
              <li>Filter by method to reconcile GPay and PhonePe statements.</li>
              <li>Use notes for recurring subscriptions or reminders.</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
