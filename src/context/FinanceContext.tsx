import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction, Employee, Component, Student, PrintJob, Project, DashboardSummary } from '@/types/finance';

interface FinanceContextType {
  transactions: Transaction[];
  employees: Employee[];
  components: Component[];
  students: Student[];
  printJobs: PrintJob[];
  projects: Project[];
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

// Sample data
const sampleTransactions: Transaction[] = [
  { id: '1', type: 'expense', category: 'rent', amount: 2500, description: 'Office Rent - December', date: '2024-12-01', createdAt: '2024-12-01' },
  { id: '2', type: 'expense', category: 'salary', amount: 8000, description: 'Monthly Payroll', date: '2024-12-01', createdAt: '2024-12-01' },
  { id: '3', type: 'expense', category: 'marketing', amount: 1500, description: 'Google Ads Campaign', date: '2024-12-05', createdAt: '2024-12-05' },
  { id: '4', type: 'income', category: 'courses', amount: 4500, description: 'Robotics Workshop Fees', date: '2024-12-03', createdAt: '2024-12-03' },
  { id: '5', type: 'income', category: '3d-printing', amount: 800, description: '3D Print Orders', date: '2024-12-07', createdAt: '2024-12-07' },
  { id: '6', type: 'income', category: 'school', amount: 3200, description: 'School Program Fees', date: '2024-12-10', createdAt: '2024-12-10' },
  { id: '7', type: 'expense', category: 'stock', amount: 650, description: 'Arduino Components', date: '2024-12-08', createdAt: '2024-12-08' },
  { id: '8', type: 'income', category: 'projects', amount: 2000, description: 'Custom Automation Project', date: '2024-12-12', createdAt: '2024-12-12' },
];

const sampleEmployees: Employee[] = [
  { id: '1', name: 'John Smith', position: 'Lead Developer', salary: 5000, startDate: '2023-01-15' },
  { id: '2', name: 'Sarah Johnson', position: 'Instructor', salary: 3000, startDate: '2023-06-01' },
];

const sampleComponents: Component[] = [
  { id: '1', name: 'Arduino Uno R3', quantity: 25, unitPrice: 22, minStock: 10, category: 'Microcontrollers' },
  { id: '2', name: 'ESP32 DevKit', quantity: 15, unitPrice: 12, minStock: 8, category: 'Microcontrollers' },
  { id: '3', name: 'Servo Motor SG90', quantity: 50, unitPrice: 4, minStock: 20, category: 'Motors' },
  { id: '4', name: 'Ultrasonic Sensor', quantity: 8, unitPrice: 3, minStock: 15, category: 'Sensors' },
  { id: '5', name: 'LED Pack (100pcs)', quantity: 12, unitPrice: 8, minStock: 5, category: 'Electronics' },
];

const sampleStudents: Student[] = [
  { id: '1', name: 'Alex Chen', email: 'alex@example.com', course: 'Robotics Fundamentals', batchId: 'B001', enrollmentDate: '2024-09-01', paymentStatus: 'paid' },
  { id: '2', name: 'Maria Garcia', email: 'maria@example.com', course: 'Arduino Workshop', batchId: 'B002', enrollmentDate: '2024-10-15', paymentStatus: 'paid' },
  { id: '3', name: 'James Wilson', email: 'james@example.com', course: 'Robotics Fundamentals', batchId: 'B001', enrollmentDate: '2024-09-01', paymentStatus: 'pending' },
];

const samplePrintJobs: PrintJob[] = [
  { id: '1', name: 'Custom Enclosure', filamentUsed: 150, filamentCost: 4.5, laborHours: 2, hourlyRate: 25, electricityCost: 1.5, totalCost: 56, date: '2024-12-05' },
  { id: '2', name: 'Robot Arm Parts', filamentUsed: 300, filamentCost: 9, laborHours: 5, hourlyRate: 25, electricityCost: 3, totalCost: 137, date: '2024-12-08' },
];

const sampleProjects: Project[] = [
  { id: '1', name: 'Home Automation System', description: 'Smart home controller with sensors', totalCost: 450, totalIncome: 1200, hoursSpent: 40, status: 'completed', startDate: '2024-10-01' },
  { id: '2', name: 'Industrial Monitoring', description: 'Factory sensor network', totalCost: 800, totalIncome: 0, hoursSpent: 25, status: 'active', startDate: '2024-11-15' },
];

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees);
  const [components, setComponents] = useState<Component[]>(sampleComponents);
  const [students, setStudents] = useState<Student[]>(sampleStudents);
  const [printJobs, setPrintJobs] = useState<PrintJob[]>(samplePrintJobs);
  const [projects, setProjects] = useState<Project[]>(sampleProjects);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = { ...employee, id: Date.now().toString() };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  const addComponent = (component: Omit<Component, 'id'>) => {
    const newComponent: Component = { ...component, id: Date.now().toString() };
    setComponents(prev => [...prev, newComponent]);
  };

  const updateComponent = (id: string, updates: Partial<Component>) => {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteComponent = (id: string) => {
    setComponents(prev => prev.filter(c => c.id !== id));
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = { ...student, id: Date.now().toString() };
    setStudents(prev => [...prev, newStudent]);
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const addPrintJob = (job: Omit<PrintJob, 'id'>) => {
    const newJob: PrintJob = { ...job, id: Date.now().toString() };
    setPrintJobs(prev => [...prev, newJob]);
  };

  const deletePrintJob = (id: string) => {
    setPrintJobs(prev => prev.filter(j => j.id !== id));
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = { ...project, id: Date.now().toString() };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
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
