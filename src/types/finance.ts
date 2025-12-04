export type TransactionType = 'income' | 'expense';

export type CategoryType = 
  | 'rent'
  | 'salary'
  | 'marketing'
  | 'general'
  | 'stock'
  | '3d-printing'
  | 'courses'
  | 'school'
  | 'projects'
  | 'utilities'
  | 'transfer'
  | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: CategoryType;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  salary: number;
  startDate: string;
}

export interface Component {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  minStock: number;
  category: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  batchId: string;
  enrollmentDate: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
}

export interface PrintJob {
  id: string;
  name: string;
  filamentUsed: number;
  filamentCost: number;
  laborHours: number;
  hourlyRate: number;
  electricityCost: number;
  totalCost: number;
  date: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  totalCost: number;
  totalIncome: number;
  hoursSpent: number;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  profit: number;
  rentTotal: number;
  salaryTotal: number;
  marketingTotal: number;
  stockValue: number;
  printJobsRevenue: number;
  coursesRevenue: number;
  schoolRevenue: number;
  projectsProfit: number;
  utilitiesTotal: number;
  transferTotal: number;
  monthlyIncome: number;
  monthlyExpense: number;
}
