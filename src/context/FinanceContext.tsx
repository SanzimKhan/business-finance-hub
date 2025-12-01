import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Transaction, Employee, Component, Student, PrintJob, Project, DashboardSummary, CategoryType } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface FinanceContextType {
  transactions: Transaction[];
  employees: Employee[];
  components: Component[];
  students: Student[];
  printJobs: PrintJob[];
  projects: Project[];
  loading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  deleteEmployee: (id: string) => void;
  addComponent: (component: Omit<Component, 'id'>) => void;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  deleteComponent: (id: string) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  deleteStudent: (id: string) => void;
  addPrintJob: (job: Omit<PrintJob, 'id'>) => void;
  deletePrintJob: (id: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getSummary: () => DashboardSummary;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const [txRes, empRes, compRes, studRes, printRes, projRes] = await Promise.all([
        supabase.from('transactions').select('*').order('date', { ascending: false }),
        supabase.from('employees').select('*').order('name'),
        supabase.from('components').select('*').order('name'),
        supabase.from('students').select('*').order('name'),
        supabase.from('print_jobs').select('*').order('date', { ascending: false }),
        supabase.from('projects').select('*').order('start_date', { ascending: false }),
      ]);

      if (txRes.data) setTransactions(txRes.data.map(t => ({
        id: t.id,
        type: t.type as 'income' | 'expense',
        category: t.category as CategoryType,
        amount: Number(t.amount),
        description: t.description || '',
        date: t.date,
        createdAt: t.created_at,
      })));

      if (empRes.data) setEmployees(empRes.data.map(e => ({
        id: e.id,
        name: e.name,
        position: e.position,
        salary: Number(e.salary),
        startDate: e.start_date,
      })));

      if (compRes.data) setComponents(compRes.data.map(c => ({
        id: c.id,
        name: c.name,
        quantity: c.quantity,
        unitPrice: Number(c.unit_price),
        minStock: c.min_stock,
        category: c.category || 'General',
      })));

      if (studRes.data) setStudents(studRes.data.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email || '',
        course: s.course,
        batchId: s.batch_id || '',
        enrollmentDate: s.enrollment_date,
        paymentStatus: s.payment_status as 'paid' | 'pending' | 'overdue',
      })));

      if (printRes.data) setPrintJobs(printRes.data.map(p => ({
        id: p.id,
        name: p.name,
        filamentUsed: Number(p.filament_used),
        filamentCost: Number(p.filament_cost),
        laborHours: Number(p.labor_hours),
        hourlyRate: Number(p.hourly_rate),
        electricityCost: Number(p.electricity_cost),
        totalCost: Number(p.total_cost),
        date: p.date,
      })));

      if (projRes.data) setProjects(projRes.data.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        totalCost: Number(p.total_cost),
        totalIncome: Number(p.total_income),
        hoursSpent: Number(p.hours_spent),
        status: p.status as 'active' | 'completed' | 'paused',
        startDate: p.start_date,
      })));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (!user) return;
    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date,
    });
    if (error) {
      toast.error('Failed to add transaction');
    } else {
      fetchData();
    }
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete transaction');
    } else {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const addEmployee = async (employee: Omit<Employee, 'id'>) => {
    if (!user) return;
    const { error } = await supabase.from('employees').insert({
      user_id: user.id,
      name: employee.name,
      position: employee.position,
      salary: employee.salary,
      start_date: employee.startDate,
    });
    if (error) {
      toast.error('Failed to add employee');
    } else {
      fetchData();
    }
  };

  const deleteEmployee = async (id: string) => {
    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete employee');
    } else {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  const addComponent = async (component: Omit<Component, 'id'>) => {
    if (!user) return;
    const { error } = await supabase.from('components').insert({
      user_id: user.id,
      name: component.name,
      quantity: component.quantity,
      unit_price: component.unitPrice,
      min_stock: component.minStock,
      category: component.category,
    });
    if (error) {
      toast.error('Failed to add component');
    } else {
      fetchData();
    }
  };

  const updateComponent = async (id: string, updates: Partial<Component>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
    if (updates.unitPrice !== undefined) dbUpdates.unit_price = updates.unitPrice;
    if (updates.minStock !== undefined) dbUpdates.min_stock = updates.minStock;
    if (updates.category !== undefined) dbUpdates.category = updates.category;

    const { error } = await supabase.from('components').update(dbUpdates).eq('id', id);
    if (error) {
      toast.error('Failed to update component');
    } else {
      fetchData();
    }
  };

  const deleteComponent = async (id: string) => {
    const { error } = await supabase.from('components').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete component');
    } else {
      setComponents(prev => prev.filter(c => c.id !== id));
    }
  };

  const addStudent = async (student: Omit<Student, 'id'>) => {
    if (!user) return;
    const { error } = await supabase.from('students').insert({
      user_id: user.id,
      name: student.name,
      email: student.email,
      course: student.course,
      batch_id: student.batchId,
      enrollment_date: student.enrollmentDate,
      payment_status: student.paymentStatus,
    });
    if (error) {
      toast.error('Failed to add student');
    } else {
      fetchData();
    }
  };

  const deleteStudent = async (id: string) => {
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete student');
    } else {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const addPrintJob = async (job: Omit<PrintJob, 'id'>) => {
    if (!user) return;
    const { error } = await supabase.from('print_jobs').insert({
      user_id: user.id,
      name: job.name,
      filament_used: job.filamentUsed,
      filament_cost: job.filamentCost,
      labor_hours: job.laborHours,
      hourly_rate: job.hourlyRate,
      electricity_cost: job.electricityCost,
      total_cost: job.totalCost,
      date: job.date,
    });
    if (error) {
      toast.error('Failed to add print job');
    } else {
      fetchData();
    }
  };

  const deletePrintJob = async (id: string) => {
    const { error } = await supabase.from('print_jobs').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete print job');
    } else {
      setPrintJobs(prev => prev.filter(j => j.id !== id));
    }
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    if (!user) return;
    const { error } = await supabase.from('projects').insert({
      user_id: user.id,
      name: project.name,
      description: project.description,
      total_cost: project.totalCost,
      total_income: project.totalIncome,
      hours_spent: project.hoursSpent,
      status: project.status,
      start_date: project.startDate,
    });
    if (error) {
      toast.error('Failed to add project');
    } else {
      fetchData();
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.totalCost !== undefined) dbUpdates.total_cost = updates.totalCost;
    if (updates.totalIncome !== undefined) dbUpdates.total_income = updates.totalIncome;
    if (updates.hoursSpent !== undefined) dbUpdates.hours_spent = updates.hoursSpent;
    if (updates.status !== undefined) dbUpdates.status = updates.status;

    const { error } = await supabase.from('projects').update(dbUpdates).eq('id', id);
    if (error) {
      toast.error('Failed to update project');
    } else {
      fetchData();
    }
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete project');
    } else {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const getSummary = (): DashboardSummary => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const rentTotal = transactions.filter(t => t.category === 'rent').reduce((sum, t) => sum + t.amount, 0);
    const salaryTotal = transactions.filter(t => t.category === 'salary').reduce((sum, t) => sum + t.amount, 0);
    const marketingTotal = transactions.filter(t => t.category === 'marketing').reduce((sum, t) => sum + t.amount, 0);
    const stockValue = components.reduce((sum, c) => sum + (c.quantity * c.unitPrice), 0);
    const printJobsRevenue = transactions.filter(t => t.category === '3d-printing' && t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const coursesRevenue = transactions.filter(t => t.category === 'courses' && t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const schoolRevenue = transactions.filter(t => t.category === 'school' && t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const projectsProfit = projects.reduce((sum, p) => sum + (p.totalIncome - p.totalCost), 0);

    return {
      totalIncome,
      totalExpense,
      profit: totalIncome - totalExpense,
      rentTotal,
      salaryTotal,
      marketingTotal,
      stockValue,
      printJobsRevenue,
      coursesRevenue,
      schoolRevenue,
      projectsProfit,
    };
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      employees,
      components,
      students,
      printJobs,
      projects,
      loading,
      addTransaction,
      deleteTransaction,
      addEmployee,
      deleteEmployee,
      addComponent,
      updateComponent,
      deleteComponent,
      addStudent,
      deleteStudent,
      addPrintJob,
      deletePrintJob,
      addProject,
      updateProject,
      deleteProject,
      getSummary,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
