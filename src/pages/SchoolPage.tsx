import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { TransactionModal } from '@/components/shared/TransactionModal';
import { TransactionTable } from '@/components/shared/TransactionTable';
import { useFinance } from '@/context/FinanceContext';
import { School, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

export default function SchoolPage() {
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const { transactions } = useFinance();

  const schoolTransactions = transactions.filter(t => t.category === 'school');
  const totalIncome = schoolTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = schoolTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const profit = totalIncome - totalExpenses;

  return (
    <MainLayout>
      <PageHeader
        title="School / Kids Program"
        description="Manage school batches and robotics kit programs"
        icon={<School className="h-6 w-6" />}
        onAddIncome={() => setIncomeModalOpen(true)}
        onAddExpense={() => setExpenseModalOpen(true)}
      />

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Program Revenue"
          value={totalIncome}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="income"
        />
        <StatCard
          title="Program Costs"
          value={totalExpenses}
          icon={<TrendingDown className="h-5 w-5" />}
          variant="expense"
        />
        <StatCard
          title="Net Profit"
          value={profit}
          icon={<DollarSign className="h-5 w-5" />}
          variant={profit >= 0 ? 'income' : 'expense'}
        />
        <StatCard
          title="Total Transactions"
          value={schoolTransactions.length}
          icon={<School className="h-5 w-5" />}
        />
      </div>

      {/* Program Info */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">School Batch Programs</h3>
          <p className="text-muted-foreground mb-4">
            Track school partnerships, batch schedules, and program fees. Add income for school program fees and expenses for materials, transportation, or kit costs.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent"></div>
              Robotics workshops
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent"></div>
              STEM education programs
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent"></div>
              After-school activities
            </li>
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Robotics Kits</h3>
          <p className="text-muted-foreground mb-4">
            Manage robotics kit sales and rentals for school programs. Track kit inventory costs and program revenues.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent"></div>
              Kit purchases and assembly
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent"></div>
              Kit rentals for programs
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent"></div>
              Maintenance and replacements
            </li>
          </ul>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">School Program Transactions</h2>
        <TransactionTable transactions={schoolTransactions} showCategory={false} />
      </div>

      {/* Modals */}
      <TransactionModal
        open={incomeModalOpen}
        onOpenChange={setIncomeModalOpen}
        defaultType="income"
        defaultCategory="school"
        title="Add School Program Income"
      />
      <TransactionModal
        open={expenseModalOpen}
        onOpenChange={setExpenseModalOpen}
        defaultType="expense"
        defaultCategory="school"
        title="Add School Program Expense"
      />
    </MainLayout>
  );
}
