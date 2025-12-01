import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { TransactionModal } from '@/components/shared/TransactionModal';
import { TransactionTable } from '@/components/shared/TransactionTable';
import { useFinance } from '@/context/FinanceContext';
import { Home, TrendingDown, Calendar } from 'lucide-react';

export default function RentPage() {
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const { transactions } = useFinance();

  const rentTransactions = transactions.filter(t => t.category === 'rent');
  const totalRent = rentTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const rentIncome = rentTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

  return (
    <MainLayout>
      <PageHeader
        title="Rent Management"
        description="Track rental costs and related expenses"
        icon={<Home className="h-6 w-6" />}
        onAddIncome={() => setIncomeModalOpen(true)}
        onAddExpense={() => setExpenseModalOpen(true)}
      />

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Rent Paid"
          value={totalRent}
          icon={<TrendingDown className="h-5 w-5" />}
          variant="expense"
        />
        <StatCard
          title="Rent-Related Income"
          value={rentIncome}
          icon={<Home className="h-5 w-5" />}
          variant="income"
        />
        <StatCard
          title="Monthly Average"
          value={rentTransactions.length > 0 ? Math.round(totalRent / Math.max(1, new Set(rentTransactions.map(t => t.date.substring(0, 7))).size)) : 0}
          icon={<Calendar className="h-5 w-5" />}
        />
      </div>

      {/* Transactions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Rent Transactions</h2>
        <TransactionTable transactions={rentTransactions} showCategory={false} />
      </div>

      {/* Modals */}
      <TransactionModal
        open={incomeModalOpen}
        onOpenChange={setIncomeModalOpen}
        defaultType="income"
        defaultCategory="rent"
        title="Add Rent-Related Income"
      />
      <TransactionModal
        open={expenseModalOpen}
        onOpenChange={setExpenseModalOpen}
        defaultType="expense"
        defaultCategory="rent"
        title="Add Rent Expense"
      />
    </MainLayout>
  );
}
