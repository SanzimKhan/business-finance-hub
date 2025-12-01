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
import { Users, DollarSign, UserPlus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SalaryPage() {
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const { transactions, employees, addEmployee, deleteEmployee } = useFinance();

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    salary: '',
    startDate: new Date().toISOString().split('T')[0],
  });

  const salaryTransactions = transactions.filter(t => t.category === 'salary');
  const totalSalary = salaryTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.salary) {
      toast.error('Please fill in all required fields');
      return;
    }
    addEmployee({
      name: newEmployee.name,
      position: newEmployee.position,
      salary: parseFloat(newEmployee.salary),
      startDate: newEmployee.startDate,
    });
    toast.success('Employee added successfully');
    setNewEmployee({ name: '', position: '', salary: '', startDate: new Date().toISOString().split('T')[0] });
    setEmployeeModalOpen(false);
  };

  const handleDeleteEmployee = (id: string) => {
    deleteEmployee(id);
    toast.success('Employee removed');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Salary Management"
        description="Manage employees and track payroll"
        icon={<Users className="h-6 w-6" />}
        onAddIncome={() => setIncomeModalOpen(true)}
        onAddExpense={() => setExpenseModalOpen(true)}
      >
        <Button variant="outline" onClick={() => setEmployeeModalOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Employees"
          value={employees.length}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Monthly Payroll"
          value={totalPayroll}
          icon={<DollarSign className="h-5 w-5" />}
          variant="expense"
        />
        <StatCard
          title="Total Salary Paid"
          value={totalSalary}
          icon={<DollarSign className="h-5 w-5" />}
          variant="expense"
        />
      </div>

      {/* Employees Table */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Employees</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead className="text-right">Monthly Salary</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(employee.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(employee.salary)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {employees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No employees added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Salary Transactions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Salary Transactions</h2>
        <TransactionTable transactions={salaryTransactions} showCategory={false} />
      </div>

      {/* Modals */}
      <TransactionModal
        open={incomeModalOpen}
        onOpenChange={setIncomeModalOpen}
        defaultType="income"
        defaultCategory="salary"
        title="Add Salary-Related Income"
      />
      <TransactionModal
        open={expenseModalOpen}
        onOpenChange={setExpenseModalOpen}
        defaultType="expense"
        defaultCategory="salary"
        title="Add Salary Expense"
      />

      {/* Add Employee Modal */}
      <Dialog open={employeeModalOpen} onOpenChange={setEmployeeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEmployee} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Monthly Salary ($)</Label>
              <Input
                id="salary"
                type="number"
                value={newEmployee.salary}
                onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={newEmployee.startDate}
                onChange={(e) => setNewEmployee({ ...newEmployee, startDate: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">Add Employee</Button>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
