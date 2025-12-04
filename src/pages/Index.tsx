import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { TransactionModal } from '@/components/shared/TransactionModal';
import { TransactionTable } from '@/components/shared/TransactionTable';
import { useFinance } from '@/context/FinanceContext';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Banknote,
  Home,
  Users,
  Megaphone,
  Package,
  Printer,
  GraduationCap,
  School,
  Briefcase,
  Zap,
  ArrowLeftRight,
  Calendar,
} from 'lucide-react';

export default function Dashboard() {
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const { transactions, getSummary } = useFinance();
  const summary = getSummary();

  const recentTransactions = transactions.slice(0, 8);

  return (
    <MainLayout>
      <PageHeader
        title="Dashboard"
        description="Overview of your business finances"
        icon={<LayoutDashboard className="h-6 w-6" />}
        onAddIncome={() => setIncomeModalOpen(true)}
        onAddExpense={() => setExpenseModalOpen(true)}
      />

      {/* Monthly Summary */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          This Month's Summary
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Monthly Income"
            value={summary.monthlyIncome}
            icon={<TrendingUp className="h-6 w-6" />}
            variant="income"
          />
          <StatCard
            title="Monthly Expenses"
            value={summary.monthlyExpense}
            icon={<TrendingDown className="h-6 w-6" />}
            variant="expense"
          />
          <StatCard
            title="Monthly Profit"
            value={summary.monthlyIncome - summary.monthlyExpense}
            icon={<Banknote className="h-6 w-6" />}
            variant={(summary.monthlyIncome - summary.monthlyExpense) >= 0 ? 'income' : 'expense'}
          />
          <StatCard
            title="Stock Value"
            value={summary.stockValue}
            icon={<Package className="h-6 w-6" />}
          />
        </div>
      </div>

      {/* Main Stats */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">All-Time Summary</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Income"
            value={summary.totalIncome}
            icon={<TrendingUp className="h-6 w-6" />}
            variant="income"
          />
          <StatCard
            title="Total Expenses"
            value={summary.totalExpense}
            icon={<TrendingDown className="h-6 w-6" />}
            variant="expense"
          />
          <StatCard
            title="Net Profit"
            value={summary.profit}
            icon={<Banknote className="h-6 w-6" />}
            variant={summary.profit >= 0 ? 'income' : 'expense'}
          />
          <StatCard
            title="Total Transfers"
            value={summary.transferTotal}
            icon={<ArrowLeftRight className="h-6 w-6" />}
          />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Category Breakdown</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <StatCard
            title="Rent Costs"
            value={summary.rentTotal}
            icon={<Home className="h-5 w-5" />}
            variant="expense"
          />
          <StatCard
            title="Salary Costs"
            value={summary.salaryTotal}
            icon={<Users className="h-5 w-5" />}
            variant="expense"
          />
          <StatCard
            title="Marketing Spend"
            value={summary.marketingTotal}
            icon={<Megaphone className="h-5 w-5" />}
            variant="expense"
          />
          <StatCard
            title="Utilities"
            value={summary.utilitiesTotal}
            icon={<Zap className="h-5 w-5" />}
            variant="expense"
          />
          <StatCard
            title="3D Printing Revenue"
            value={summary.printJobsRevenue}
            icon={<Printer className="h-5 w-5" />}
            variant="income"
          />
          <StatCard
            title="Courses Revenue"
            value={summary.coursesRevenue}
            icon={<GraduationCap className="h-5 w-5" />}
            variant="income"
          />
          <StatCard
            title="School Programs"
            value={summary.schoolRevenue}
            icon={<School className="h-5 w-5" />}
            variant="income"
          />
          <StatCard
            title="Projects Profit"
            value={summary.projectsProfit}
            icon={<Briefcase className="h-5 w-5" />}
            variant={summary.projectsProfit >= 0 ? 'income' : 'expense'}
          />
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent Transactions</h2>
        <TransactionTable transactions={recentTransactions} />
      </div>

      {/* Modals */}
      <TransactionModal
        open={incomeModalOpen}
        onOpenChange={setIncomeModalOpen}
        defaultType="income"
      />
      <TransactionModal
        open={expenseModalOpen}
        onOpenChange={setExpenseModalOpen}
        defaultType="expense"
      />
    </MainLayout>
  );
}
