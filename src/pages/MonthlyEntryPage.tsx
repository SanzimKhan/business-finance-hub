import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { TransactionModal } from '@/components/shared/TransactionModal';
import { TransactionTable } from '@/components/shared/TransactionTable';
import { useFinance } from '@/context/FinanceContext';
import { Calendar, ArrowLeft, TrendingUp, TrendingDown, Banknote, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 6 }, (_, i) => currentYear - 3 + i);

export default function MonthlyEntryPage() {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const { transactions } = useFinance();

  // Get transactions for selected month
  const monthTransactions = transactions.filter(t => {
    if (selectedMonth === null) return false;
    const date = new Date(t.date);
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  });

  // Calculate monthly stats
  const monthlyIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyExpense = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Get stats for each month (for the grid view)
  const getMonthStats = (monthIndex: number) => {
    const monthTx = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === monthIndex && date.getFullYear() === selectedYear;
    });
    const income = monthTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = monthTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, count: monthTx.length };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Month detail view
  if (selectedMonth !== null) {
    return (
      <MainLayout>
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedMonth(null)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Months
          </Button>
          
          <PageHeader
            title={`${months[selectedMonth]} ${selectedYear}`}
            description="View and manage entries for this month"
            icon={<Calendar className="h-6 w-6" />}
            onAddIncome={() => setIncomeModalOpen(true)}
            onAddExpense={() => setExpenseModalOpen(true)}
          />
        </div>

        {/* Monthly Stats */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <StatCard
            title="Monthly Income"
            value={monthlyIncome}
            icon={<TrendingUp className="h-6 w-6" />}
            variant="income"
          />
          <StatCard
            title="Monthly Expenses"
            value={monthlyExpense}
            icon={<TrendingDown className="h-6 w-6" />}
            variant="expense"
          />
          <StatCard
            title="Net Profit"
            value={monthlyIncome - monthlyExpense}
            icon={<Banknote className="h-6 w-6" />}
            variant={(monthlyIncome - monthlyExpense) >= 0 ? 'income' : 'expense'}
          />
        </div>

        {/* Transactions */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">
            Transactions ({monthTransactions.length})
          </h2>
          {monthTransactions.length > 0 ? (
            <TransactionTable transactions={monthTransactions} />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No transactions for {months[selectedMonth]} {selectedYear}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="income" onClick={() => setIncomeModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Income
                  </Button>
                  <Button variant="expense" onClick={() => setExpenseModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Expense
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Modals with pre-selected month */}
        <TransactionModal
          open={incomeModalOpen}
          onOpenChange={setIncomeModalOpen}
          defaultType="income"
          defaultMonth={selectedMonth}
          defaultYear={selectedYear}
        />
        <TransactionModal
          open={expenseModalOpen}
          onOpenChange={setExpenseModalOpen}
          defaultType="expense"
          defaultMonth={selectedMonth}
          defaultYear={selectedYear}
        />
      </MainLayout>
    );
  }

  // Month grid view
  return (
    <MainLayout>
      <PageHeader
        title="Monthly Entries"
        description="Click on a month to view and add entries"
        icon={<Calendar className="h-6 w-6" />}
      />

      {/* Year Selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {years.map(year => (
          <Button
            key={year}
            variant={selectedYear === year ? 'default' : 'outline'}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </Button>
        ))}
      </div>

      {/* Month Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {months.map((month, index) => {
          const stats = getMonthStats(index);
          const isCurrentMonth = index === new Date().getMonth() && selectedYear === currentYear;
          
          return (
            <Card
              key={month}
              className={cn(
                "cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]",
                isCurrentMonth && "ring-2 ring-primary"
              )}
              onClick={() => setSelectedMonth(index)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{month}</span>
                  {isCurrentMonth && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                      Current
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Income:</span>
                    <span className="text-green-500 font-medium">
                      {formatCurrency(stats.income)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expense:</span>
                    <span className="text-red-500 font-medium">
                      {formatCurrency(stats.expense)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-border">
                    <span className="text-muted-foreground">Entries:</span>
                    <span className="font-medium">{stats.count}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </MainLayout>
  );
}