import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { TransactionModal } from '@/components/shared/TransactionModal';
import { TransactionTable } from '@/components/shared/TransactionTable';
import { useFinance } from '@/context/FinanceContext';
import { Receipt, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function ExpensesPage() {
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const { transactions } = useFinance();

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <MainLayout>
      <PageHeader
        title="General Expenses & Income"
        description="Track all financial transactions"
        icon={<Receipt className="h-6 w-6" />}
        onAddIncome={() => setIncomeModalOpen(true)}
        onAddExpense={() => setExpenseModalOpen(true)}
      />

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Income"
          value={totalIncome}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="income"
        />
        <StatCard
          title="Total Expenses"
          value={totalExpense}
          icon={<TrendingDown className="h-5 w-5" />}
          variant="expense"
        />
        <StatCard
          title="Balance"
          value={balance}
          icon={<DollarSign className="h-5 w-5" />}
          variant={balance >= 0 ? 'income' : 'expense'}
        />
        <StatCard
          title="Transactions"
          value={transactions.length}
          icon={<Receipt className="h-5 w-5" />}
        />
      </div>

      {/* All Transactions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">All Transactions</h2>
        <TransactionTable transactions={transactions} />
      </div>

      {/* Modals */}
      <TransactionModal
        open={incomeModalOpen}
        onOpenChange={setIncomeModalOpen}
        defaultType="income"
        defaultCategory="general"
        title="Add Income"
      />
      <TransactionModal
        open={expenseModalOpen}
        onOpenChange={setExpenseModalOpen}
        defaultType="expense"
        defaultCategory="general"
        title="Add Expense"
      />
    </MainLayout>
  );
}
