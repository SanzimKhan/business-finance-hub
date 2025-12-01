import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      toast.error('Failed to load transactions');
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (transaction: {
    type: string;
    category: string;
    amount: number;
    description?: string;
    date: string;
  }) => {
    if (!user) return;
    const { error } = await supabase.from('transactions').insert({
      ...transaction,
      user_id: user.id,
    });
    if (error) {
      toast.error('Failed to add transaction');
    } else {
      toast.success('Transaction added');
      fetchTransactions();
    }
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete transaction');
    } else {
      toast.success('Transaction deleted');
      fetchTransactions();
    }
  };

  return { transactions, loading, addTransaction, deleteTransaction, refetch: fetchTransactions };
}

export function useEmployees() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('name');
    
    if (error) {
      toast.error('Failed to load employees');
    } else {
      setEmployees(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const addEmployee = async (employee: {
    name: string;
    position: string;
    salary: number;
    start_date: string;
  }) => {
    if (!user) return;
    const { error } = await supabase.from('employees').insert({
      ...employee,
      user_id: user.id,
    });
    if (error) {
      toast.error('Failed to add employee');
    } else {
      toast.success('Employee added');
      fetchEmployees();
    }
  };

  const deleteEmployee = async (id: string) => {
    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete employee');
    } else {
      toast.success('Employee deleted');
      fetchEmployees();
    }
  };

  return { employees, loading, addEmployee, deleteEmployee, refetch: fetchEmployees };
}

export function useComponents() {
  const { user } = useAuth();
  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComponents = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .order('name');
    
    if (error) {
      toast.error('Failed to load components');
    } else {
      setComponents(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  const addComponent = async (component: {
    name: string;
    quantity: number;
    unit_price: number;
    min_stock: number;
    category?: string;
  }) => {
    if (!user) return;
    const { error } = await supabase.from('components').insert({
      ...component,
      user_id: user.id,
    });
    if (error) {
      toast.error('Failed to add component');
    } else {
      toast.success('Component added');
      fetchComponents();
    }
  };

  const updateComponent = async (id: string, updates: Partial<{
    name: string;
    quantity: number;
    unit_price: number;
    min_stock: number;
    category: string;
  }>) => {
    const { error } = await supabase.from('components').update(updates).eq('id', id);
    if (error) {
      toast.error('Failed to update component');
    } else {
      toast.success('Component updated');
      fetchComponents();
    }
  };

  const deleteComponent = async (id: string) => {
    const { error } = await supabase.from('components').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete component');
    } else {
      toast.success('Component deleted');
      fetchComponents();
    }
  };

  return { components, loading, addComponent, updateComponent, deleteComponent, refetch: fetchComponents };
}

export function useStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name');
    
    if (error) {
      toast.error('Failed to load students');
    } else {
      setStudents(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const addStudent = async (student: {
    name: string;
    email?: string;
    course: string;
    batch_id?: string;
    enrollment_date: string;
    payment_status: string;
  }) => {
    if (!user) return;
    const { error } = await supabase.from('students').insert({
      ...student,
      user_id: user.id,
    });
    if (error) {
      toast.error('Failed to add student');
    } else {
      toast.success('Student added');
      fetchStudents();
    }
  };

  const deleteStudent = async (id: string) => {
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete student');
    } else {
      toast.success('Student deleted');
      fetchStudents();
    }
  };

  return { students, loading, addStudent, deleteStudent, refetch: fetchStudents };
}

export function usePrintJobs() {
  const { user } = useAuth();
  const [printJobs, setPrintJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrintJobs = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('print_jobs')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      toast.error('Failed to load print jobs');
    } else {
      setPrintJobs(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchPrintJobs();
  }, [fetchPrintJobs]);

  const addPrintJob = async (job: {
    name: string;
    filament_used: number;
    filament_cost: number;
    labor_hours: number;
    hourly_rate: number;
    electricity_cost: number;
    total_cost: number;
    date: string;
  }) => {
    if (!user) return;
    const { error } = await supabase.from('print_jobs').insert({
      ...job,
      user_id: user.id,
    });
    if (error) {
      toast.error('Failed to add print job');
    } else {
      toast.success('Print job added');
      fetchPrintJobs();
    }
  };

  const deletePrintJob = async (id: string) => {
    const { error } = await supabase.from('print_jobs').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete print job');
    } else {
      toast.success('Print job deleted');
      fetchPrintJobs();
    }
  };

  return { printJobs, loading, addPrintJob, deletePrintJob, refetch: fetchPrintJobs };
}

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('start_date', { ascending: false });
    
    if (error) {
      toast.error('Failed to load projects');
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const addProject = async (project: {
    name: string;
    description?: string;
    total_cost: number;
    total_income: number;
    hours_spent: number;
    status: string;
    start_date: string;
  }) => {
    if (!user) return;
    const { error } = await supabase.from('projects').insert({
      ...project,
      user_id: user.id,
    });
    if (error) {
      toast.error('Failed to add project');
    } else {
      toast.success('Project added');
      fetchProjects();
    }
  };

  const updateProject = async (id: string, updates: Partial<{
    name: string;
    description: string;
    total_cost: number;
    total_income: number;
    hours_spent: number;
    status: string;
  }>) => {
    const { error } = await supabase.from('projects').update(updates).eq('id', id);
    if (error) {
      toast.error('Failed to update project');
    } else {
      toast.success('Project updated');
      fetchProjects();
    }
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete project');
    } else {
      toast.success('Project deleted');
      fetchProjects();
    }
  };

  return { projects, loading, addProject, updateProject, deleteProject, refetch: fetchProjects };
}
