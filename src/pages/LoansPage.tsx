import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Landmark, Plus, Trash2, CreditCard, Calculator, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

interface Loan {
  id: string;
  name: string;
  principal_amount: number;
  interest_rate: number;
  total_emi_count: number;
  paid_emi_count: number;
  emi_amount: number;
  start_date: string;
  lender?: string;
  notes?: string;
  status: string;
}

export default function LoansPage() {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    principal_amount: 0,
    interest_rate: 0,
    total_emi_count: 12,
    emi_amount: 0,
    start_date: new Date().toISOString().split('T')[0],
    lender: '',
    notes: '',
  });

  useEffect(() => {
    fetchLoans();
  }, [user]);

  const fetchLoans = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLoans(data || []);
    } catch (error: any) {
      console.error('Error fetching loans:', error);
      toast.error('Failed to load loans');
    } finally {
      setLoading(false);
    }
  };

  const calculateEMI = () => {
    const P = formData.principal_amount;
    const r = formData.interest_rate / 100 / 12;
    const n = formData.total_emi_count;
    
    if (P > 0 && n > 0) {
      if (r === 0) {
        setFormData({ ...formData, emi_amount: P / n });
      } else {
        const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        setFormData({ ...formData, emi_amount: Math.round(emi) });
      }
    }
  };

  const handleAddLoan = async () => {
    if (!user) return;
    try {
      const { error } = await supabase.from('loans').insert({
        ...formData,
        user_id: user.id,
        paid_emi_count: 0,
        status: 'active',
      });

      if (error) throw error;
      toast.success('Loan added');
      setIsAddOpen(false);
      setFormData({
        name: '',
        principal_amount: 0,
        interest_rate: 0,
        total_emi_count: 12,
        emi_amount: 0,
        start_date: new Date().toISOString().split('T')[0],
        lender: '',
        notes: '',
      });
      fetchLoans();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add loan');
    }
  };

  const handlePayEMI = async (loan: Loan) => {
    if (loan.paid_emi_count >= loan.total_emi_count) {
      toast.info('All EMIs already paid');
      return;
    }

    try {
      const newPaidCount = loan.paid_emi_count + 1;
      const newStatus = newPaidCount >= loan.total_emi_count ? 'completed' : 'active';

      const { error } = await supabase
        .from('loans')
        .update({ paid_emi_count: newPaidCount, status: newStatus })
        .eq('id', loan.id);

      if (error) throw error;
      toast.success('EMI payment recorded');
      fetchLoans();
    } catch (error: any) {
      toast.error(error.message || 'Failed to record payment');
    }
  };

  const handleDeleteLoan = async (id: string) => {
    try {
      const { error } = await supabase.from('loans').delete().eq('id', id);
      if (error) throw error;
      toast.success('Loan removed');
      fetchLoans();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete loan');
    }
  };

  const formatCurrency = (amount: number) => `৳${amount.toLocaleString('en-BD')}`;

  const totalDebt = loans.reduce((sum, loan) => {
    const remaining = (loan.total_emi_count - loan.paid_emi_count) * loan.emi_amount;
    return sum + remaining;
  }, 0);

  const totalPrincipal = loans.reduce((sum, loan) => sum + loan.principal_amount, 0);
  const monthlyEMI = loans.filter(l => l.status === 'active').reduce((sum, loan) => sum + loan.emi_amount, 0);
  const activeLoans = loans.filter(l => l.status === 'active').length;

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Loans & Liabilities"
          description="Track company loans, EMIs, and debt management"
          icon={Landmark}
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-destructive/10 to-destructive/5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-destructive/20">
                <div className="h-6 w-6 text-destructive"><AlertTriangle className="h-6 w-6" /></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Outstanding</p>
                <p className="text-2xl font-bold text-destructive">{formatCurrency(totalDebt)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/20">
                <div className="h-6 w-6 text-primary"><Landmark className="h-6 w-6" /></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Principal</p>
                <p className="text-2xl font-bold">{formatCurrency(totalPrincipal)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-warning/10 to-warning/5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-warning/20">
                <div className="h-6 w-6 text-warning"><CreditCard className="h-6 w-6" /></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly EMI</p>
                <p className="text-2xl font-bold">{formatCurrency(monthlyEMI)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-success/20">
                <div className="h-6 w-6 text-success"><CheckCircle className="h-6 w-6" /></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Loans</p>
                <p className="text-2xl font-bold">{activeLoans}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Add Loan Button */}
        <div className="flex justify-end">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Loan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Loan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Loan Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Equipment Loan"
                  />
                </div>
                <div>
                  <Label>Lender</Label>
                  <Input
                    value={formData.lender}
                    onChange={(e) => setFormData({ ...formData, lender: e.target.value })}
                    placeholder="Bank/Institution name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Principal Amount (৳)</Label>
                    <Input
                      type="number"
                      value={formData.principal_amount}
                      onChange={(e) => setFormData({ ...formData, principal_amount: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label>Interest Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.interest_rate}
                      onChange={(e) => setFormData({ ...formData, interest_rate: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Total EMIs</Label>
                    <Input
                      type="number"
                      value={formData.total_emi_count}
                      onChange={(e) => setFormData({ ...formData, total_emi_count: parseInt(e.target.value) || 12 })}
                    />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label>EMI Amount (৳)</Label>
                    <Input
                      type="number"
                      value={formData.emi_amount}
                      onChange={(e) => setFormData({ ...formData, emi_amount: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <Button type="button" variant="outline" className="mt-6" onClick={calculateEMI}>
                    <Calculator className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Optional notes"
                  />
                </div>
                <Button onClick={handleAddLoan} className="w-full">Add Loan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Loans List */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : loans.length === 0 ? (
          <Card className="p-12 text-center">
            <Landmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No loans recorded yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {loans.map((loan) => {
              const progress = (loan.paid_emi_count / loan.total_emi_count) * 100;
              const remainingAmount = (loan.total_emi_count - loan.paid_emi_count) * loan.emi_amount;
              const totalPayable = loan.total_emi_count * loan.emi_amount;
              const interestPaid = totalPayable - loan.principal_amount;

              return (
                <Card key={loan.id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{loan.name}</h3>
                        <Badge variant={loan.status === 'completed' ? 'default' : 'secondary'}>
                          {loan.status}
                        </Badge>
                      </div>
                      {loan.lender && (
                        <p className="text-sm text-muted-foreground mb-3">Lender: {loan.lender}</p>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Principal</p>
                          <p className="font-semibold">{formatCurrency(loan.principal_amount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Interest Rate</p>
                          <p className="font-semibold">{loan.interest_rate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Monthly EMI</p>
                          <p className="font-semibold">{formatCurrency(loan.emi_amount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Remaining</p>
                          <p className="font-semibold text-destructive">{formatCurrency(remainingAmount)}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>EMI Progress</span>
                          <span>{loan.paid_emi_count} / {loan.total_emi_count}</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {loan.status === 'active' && (
                        <Button variant="outline" onClick={() => handlePayEMI(loan)}>
                          Pay EMI
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteLoan(loan.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
