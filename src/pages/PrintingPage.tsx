import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { TransactionModal } from '@/components/shared/TransactionModal';
import { TransactionTable } from '@/components/shared/TransactionTable';
import { useFinance } from '@/context/FinanceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer, DollarSign, Clock, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PrintingPage() {
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const { transactions, printJobs, addPrintJob, deletePrintJob, addTransaction } = useFinance();

  const [newJob, setNewJob] = useState({
    name: '',
    filamentUsed: '',
    filamentCostPerGram: '0.03',
    laborHours: '',
    hourlyRate: '25',
    electricityCost: '',
  });

  const printTransactions = transactions.filter(t => t.category === '3d-printing');
  const totalRevenue = printTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalCost = printJobs.reduce((sum, j) => sum + j.totalCost, 0);
  const totalHours = printJobs.reduce((sum, j) => sum + j.laborHours, 0);

  const calculateCost = () => {
    const filament = parseFloat(newJob.filamentUsed) * parseFloat(newJob.filamentCostPerGram);
    const labor = parseFloat(newJob.laborHours) * parseFloat(newJob.hourlyRate);
    const electricity = parseFloat(newJob.electricityCost) || 0;
    return filament + labor + electricity;
  };

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.name || !newJob.filamentUsed || !newJob.laborHours) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const filamentCost = parseFloat(newJob.filamentUsed) * parseFloat(newJob.filamentCostPerGram);
    const totalCost = calculateCost();
    
    addPrintJob({
      name: newJob.name,
      filamentUsed: parseFloat(newJob.filamentUsed),
      filamentCost,
      laborHours: parseFloat(newJob.laborHours),
      hourlyRate: parseFloat(newJob.hourlyRate),
      electricityCost: parseFloat(newJob.electricityCost) || 0,
      totalCost,
      date: new Date().toISOString().split('T')[0],
    });

    // Auto-add as expense
    addTransaction({
      type: 'expense',
      category: '3d-printing',
      amount: totalCost,
      description: `3D Print Job: ${newJob.name}`,
      date: new Date().toISOString().split('T')[0],
    });

    toast.success('Print job added successfully');
    setNewJob({
      name: '',
      filamentUsed: '',
      filamentCostPerGram: '0.03',
      laborHours: '',
      hourlyRate: '25',
      electricityCost: '',
    });
    setJobModalOpen(false);
  };

  const handleDeleteJob = (id: string) => {
    deletePrintJob(id);
    toast.success('Print job removed');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <MainLayout>
      <PageHeader
        title="3D Printing Manager"
        description="Track filament, labor, and print costs"
        icon={<Printer className="h-6 w-6" />}
        onAddIncome={() => setIncomeModalOpen(true)}
        onAddExpense={() => setExpenseModalOpen(true)}
      >
        <Button variant="outline" onClick={() => setJobModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Print Job
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={totalRevenue}
          icon={<DollarSign className="h-5 w-5" />}
          variant="income"
        />
        <StatCard
          title="Total Costs"
          value={totalCost}
          icon={<Printer className="h-5 w-5" />}
          variant="expense"
        />
        <StatCard
          title="Profit"
          value={totalRevenue - totalCost}
          icon={<DollarSign className="h-5 w-5" />}
          variant={totalRevenue - totalCost >= 0 ? 'income' : 'expense'}
        />
        <StatCard
          title="Total Hours"
          value={`${totalHours}h`}
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* Print Jobs Table */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Print Jobs</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Job Name</TableHead>
                <TableHead className="text-right">Filament (g)</TableHead>
                <TableHead className="text-right">Filament Cost</TableHead>
                <TableHead className="text-right">Labor (h)</TableHead>
                <TableHead className="text-right">Labor Cost</TableHead>
                <TableHead className="text-right">Total Cost</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {printJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.name}</TableCell>
                  <TableCell className="text-right">{job.filamentUsed}g</TableCell>
                  <TableCell className="text-right">{formatCurrency(job.filamentCost)}</TableCell>
                  <TableCell className="text-right">{job.laborHours}h</TableCell>
                  <TableCell className="text-right">{formatCurrency(job.laborHours * job.hourlyRate)}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(job.totalCost)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteJob(job.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {printJobs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No print jobs recorded
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">3D Printing Transactions</h2>
        <TransactionTable transactions={printTransactions} showCategory={false} />
      </div>

      {/* Modals */}
      <TransactionModal
        open={incomeModalOpen}
        onOpenChange={setIncomeModalOpen}
        defaultType="income"
        defaultCategory="3d-printing"
        title="Add 3D Print Income"
      />
      <TransactionModal
        open={expenseModalOpen}
        onOpenChange={setExpenseModalOpen}
        defaultType="expense"
        defaultCategory="3d-printing"
        title="Add 3D Print Expense"
      />

      {/* New Print Job Modal */}
      <Dialog open={jobModalOpen} onOpenChange={setJobModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New 3D Print Job</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddJob} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobName">Job Name</Label>
              <Input
                id="jobName"
                value={newJob.name}
                onChange={(e) => setNewJob({ ...newJob, name: e.target.value })}
                placeholder="e.g., Custom Enclosure"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filament">Filament Used (g)</Label>
                <Input
                  id="filament"
                  type="number"
                  value={newJob.filamentUsed}
                  onChange={(e) => setNewJob({ ...newJob, filamentUsed: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filamentCost">Cost per Gram ($)</Label>
                <Input
                  id="filamentCost"
                  type="number"
                  step="0.01"
                  value={newJob.filamentCostPerGram}
                  onChange={(e) => setNewJob({ ...newJob, filamentCostPerGram: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hours">Labor Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  step="0.5"
                  value={newJob.laborHours}
                  onChange={(e) => setNewJob({ ...newJob, laborHours: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Hourly Rate ($)</Label>
                <Input
                  id="rate"
                  type="number"
                  value={newJob.hourlyRate}
                  onChange={(e) => setNewJob({ ...newJob, hourlyRate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="electricity">Electricity Cost ($)</Label>
              <Input
                id="electricity"
                type="number"
                step="0.01"
                value={newJob.electricityCost}
                onChange={(e) => setNewJob({ ...newJob, electricityCost: e.target.value })}
                placeholder="Optional"
              />
            </div>
            {newJob.filamentUsed && newJob.laborHours && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm text-muted-foreground">Estimated Cost</p>
                <p className="text-xl font-bold">{formatCurrency(calculateCost())}</p>
              </div>
            )}
            <Button type="submit" className="w-full">Add Print Job</Button>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
