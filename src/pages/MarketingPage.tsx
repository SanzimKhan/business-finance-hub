import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { TransactionModal } from '@/components/shared/TransactionModal';
import { TransactionTable } from '@/components/shared/TransactionTable';
import { useFinance } from '@/context/FinanceContext';
import { Megaphone, TrendingUp, TrendingDown, Target } from 'lucide-react';

export default function MarketingPage() {
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const { transactions } = useFinance();

  const marketingTransactions = transactions.filter(t => t.category === 'marketing');
  const totalSpend = marketingTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = marketingTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const roi = totalSpend > 0 ? ((totalIncome - totalSpend) / totalSpend * 100).toFixed(1) : '0';

  return (
    <MainLayout>
      <PageHeader
        title="Marketing Budget"
        description="Track ad spending and campaign ROI"
        icon={<Megaphone className="h-6 w-6" />}
        onAddIncome={() => setIncomeModalOpen(true)}
        onAddExpense={() => setExpenseModalOpen(true)}
      />

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Ad Spend"
          value={totalSpend}
          icon={<TrendingDown className="h-5 w-5" />}
          variant="expense"
        />
        <StatCard
          title="Marketing Income"
          value={totalIncome}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="income"
        />
        <StatCard
          title="Net Result"
          value={totalIncome - totalSpend}
          icon={<Megaphone className="h-5 w-5" />}
          variant={totalIncome - totalSpend >= 0 ? 'income' : 'expense'}
        />
        <StatCard
          title="ROI"
          value={`${roi}%`}
          icon={<Target className="h-5 w-5" />}
          variant={parseFloat(roi) >= 0 ? 'income' : 'expense'}
        />
      </div>

      {/* Transactions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Marketing Transactions</h2>
        <TransactionTable transactions={marketingTransactions} showCategory={false} />
      </div>

      {/* Modals */}
      <TransactionModal
        open={incomeModalOpen}
        onOpenChange={setIncomeModalOpen}
        defaultType="income"
        defaultCategory="marketing"
        title="Add Marketing Income"
      />
      <TransactionModal
        open={expenseModalOpen}
        onOpenChange={setExpenseModalOpen}
        defaultType="expense"
        defaultCategory="marketing"
        title="Add Marketing Expense"
      />
    </MainLayout>
  );
}
