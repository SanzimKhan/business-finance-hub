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
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Users, Banknote, UserPlus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function CoursesPage() {
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const { transactions, students, addStudent, deleteStudent } = useFinance();

  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    course: '',
    batchId: '',
    paymentStatus: 'pending' as 'paid' | 'pending' | 'overdue',
  });

  const courseTransactions = transactions.filter(t => t.category === 'courses');
  const totalRevenue = courseTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const paidStudents = students.filter(s => s.paymentStatus === 'paid').length;
  const pendingPayments = students.filter(s => s.paymentStatus !== 'paid').length;

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.course) {
      toast.error('Please fill in all required fields');
      return;
    }
    addStudent({
      ...newStudent,
      enrollmentDate: new Date().toISOString().split('T')[0],
    });
    toast.success('Student enrolled successfully');
    setNewStudent({ name: '', email: '', course: '', batchId: '', paymentStatus: 'pending' });
    setStudentModalOpen(false);
  };

  const handleDeleteStudent = (id: string) => {
    deleteStudent(id);
    toast.success('Student removed');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-income-bg text-income';
      case 'pending': return 'bg-warning/10 text-warning';
      case 'overdue': return 'bg-expense-bg text-expense';
      default: return '';
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Courses Management"
        description="Manage students and track course payments"
        icon={<GraduationCap className="h-6 w-6" />}
        onAddIncome={() => setIncomeModalOpen(true)}
        onAddExpense={() => setExpenseModalOpen(true)}
      >
        <Button variant="outline" onClick={() => setStudentModalOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Enroll Student
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={students.length}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Course Revenue"
          value={totalRevenue}
          icon={<Banknote className="h-5 w-5" />}
          variant="income"
        />
        <StatCard
          title="Paid Students"
          value={paidStudents}
          icon={<GraduationCap className="h-5 w-5" />}
          variant="income"
        />
        <StatCard
          title="Pending Payments"
          value={pendingPayments}
          icon={<Users className="h-5 w-5" />}
          variant={pendingPayments > 0 ? 'expense' : 'default'}
        />
      </div>

      {/* Students Table */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Enrolled Students</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="text-muted-foreground">{student.email}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{student.batchId || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(getStatusColor(student.paymentStatus))}>
                      {student.paymentStatus.charAt(0).toUpperCase() + student.paymentStatus.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteStudent(student.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No students enrolled
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Course Transactions</h2>
        <TransactionTable transactions={courseTransactions} showCategory={false} />
      </div>

      {/* Modals */}
      <TransactionModal
        open={incomeModalOpen}
        onOpenChange={setIncomeModalOpen}
        defaultType="income"
        defaultCategory="courses"
        title="Add Course Income"
      />
      <TransactionModal
        open={expenseModalOpen}
        onOpenChange={setExpenseModalOpen}
        defaultType="expense"
        defaultCategory="courses"
        title="Add Course Expense"
      />

      {/* Enroll Student Modal */}
      <Dialog open={studentModalOpen} onOpenChange={setStudentModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enroll New Student</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Course Name</Label>
              <Input
                id="course"
                value={newStudent.course}
                onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
                placeholder="e.g., Robotics Fundamentals"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch">Batch ID</Label>
              <Input
                id="batch"
                value={newStudent.batchId}
                onChange={(e) => setNewStudent({ ...newStudent, batchId: e.target.value })}
                placeholder="e.g., B001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Payment Status</Label>
              <Select 
                value={newStudent.paymentStatus} 
                onValueChange={(value) => setNewStudent({ ...newStudent, paymentStatus: value as 'paid' | 'pending' | 'overdue' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Enroll Student</Button>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
