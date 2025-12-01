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
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, DollarSign, Clock, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ProjectsPage() {
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const { transactions, projects, addProject, deleteProject } = useFinance();

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    totalCost: '',
    totalIncome: '',
    hoursSpent: '',
    status: 'active' as 'active' | 'completed' | 'paused',
  });

  const projectTransactions = transactions.filter(t => t.category === 'projects');
  const totalProfit = projects.reduce((sum, p) => sum + (p.totalIncome - p.totalCost), 0);
  const totalHours = projects.reduce((sum, p) => sum + p.hoursSpent, 0);
  const activeProjects = projects.filter(p => p.status === 'active').length;

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) {
      toast.error('Please enter a project name');
      return;
    }
    addProject({
      name: newProject.name,
      description: newProject.description,
      totalCost: parseFloat(newProject.totalCost) || 0,
      totalIncome: parseFloat(newProject.totalIncome) || 0,
      hoursSpent: parseFloat(newProject.hoursSpent) || 0,
      status: newProject.status,
      startDate: new Date().toISOString().split('T')[0],
    });
    toast.success('Project added successfully');
    setNewProject({ name: '', description: '', totalCost: '', totalIncome: '', hoursSpent: '', status: 'active' });
    setProjectModalOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    toast.success('Project removed');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-income-bg text-income';
      case 'completed': return 'bg-primary/10 text-primary';
      case 'paused': return 'bg-warning/10 text-warning';
      default: return '';
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Personal Projects"
        description="Track project costs, income, and profitability"
        icon={<Briefcase className="h-6 w-6" />}
        onAddIncome={() => setIncomeModalOpen(true)}
        onAddExpense={() => setExpenseModalOpen(true)}
      >
        <Button variant="outline" onClick={() => setProjectModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={projects.length}
          icon={<Briefcase className="h-5 w-5" />}
        />
        <StatCard
          title="Active Projects"
          value={activeProjects}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="income"
        />
        <StatCard
          title="Total Profit/Loss"
          value={totalProfit}
          icon={totalProfit >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
          variant={totalProfit >= 0 ? 'income' : 'expense'}
        />
        <StatCard
          title="Total Hours"
          value={`${totalHours}h`}
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* Projects Table */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Projects</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Income</TableHead>
                <TableHead className="text-right">Profit/Loss</TableHead>
                <TableHead className="text-right">Hours</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => {
                const profit = project.totalIncome - project.totalCost;
                return (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{project.name}</p>
                        {project.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(getStatusColor(project.status))}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-expense">{formatCurrency(project.totalCost)}</TableCell>
                    <TableCell className="text-right text-income">{formatCurrency(project.totalIncome)}</TableCell>
                    <TableCell className={cn(
                      'text-right font-semibold',
                      profit >= 0 ? 'text-income' : 'text-expense'
                    )}>
                      {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
                    </TableCell>
                    <TableCell className="text-right">{project.hoursSpent}h</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProject(project.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {projects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No projects added
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Project Transactions</h2>
        <TransactionTable transactions={projectTransactions} showCategory={false} />
      </div>

      {/* Modals */}
      <TransactionModal
        open={incomeModalOpen}
        onOpenChange={setIncomeModalOpen}
        defaultType="income"
        defaultCategory="projects"
        title="Add Project Income"
      />
      <TransactionModal
        open={expenseModalOpen}
        onOpenChange={setExpenseModalOpen}
        defaultType="expense"
        defaultCategory="projects"
        title="Add Project Expense"
      />

      {/* New Project Modal */}
      <Dialog open={projectModalOpen} onOpenChange={setProjectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddProject} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Total Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={newProject.totalCost}
                  onChange={(e) => setNewProject({ ...newProject, totalCost: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="income">Total Income ($)</Label>
                <Input
                  id="income"
                  type="number"
                  step="0.01"
                  value={newProject.totalIncome}
                  onChange={(e) => setNewProject({ ...newProject, totalIncome: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hours">Hours Spent</Label>
                <Input
                  id="hours"
                  type="number"
                  value={newProject.hoursSpent}
                  onChange={(e) => setNewProject({ ...newProject, hoursSpent: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newProject.status} 
                  onValueChange={(value) => setNewProject({ ...newProject, status: value as 'active' | 'completed' | 'paused' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full">Create Project</Button>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
