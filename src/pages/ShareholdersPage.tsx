import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Users, Plus, Edit2, Trash2, TrendingUp, Percent, Banknote, Calendar } from 'lucide-react';

interface Shareholder {
  id: string;
  name: string;
  designation: string;
  ownership_percentage: number;
  total_invested: number;
  email?: string;
  phone?: string;
  photo_url?: string;
}

interface Investment {
  id: string;
  shareholder_id: string;
  amount: number;
  investment_date: string;
  description?: string;
}

const initialShareholders = [
  { name: 'MD Sanzim Rahman Khan', designation: 'Founder & CEO', ownership_percentage: 40 },
  { name: 'MD Ali Razin', designation: 'Co-Founder & CMO', ownership_percentage: 20 },
  { name: 'Saadat S Rahman', designation: 'CTO', ownership_percentage: 10 },
  { name: 'Muztahid Durjoy', designation: 'CSE, Chief Software Engineer', ownership_percentage: 10 },
  { name: 'Rubaiayat', designation: 'Chief Instructor', ownership_percentage: 2 },
  { name: 'Dipanjan', designation: 'Chief Mechatronics Engineer', ownership_percentage: 2 },
  { name: 'Dr. Khalilur Rahman', designation: 'Advisor', ownership_percentage: 3 },
];

export default function ShareholdersPage() {
  const { user } = useAuth();
  const [shareholders, setShareholders] = useState<Shareholder[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isInvestOpen, setIsInvestOpen] = useState(false);
  const [selectedShareholder, setSelectedShareholder] = useState<Shareholder | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    ownership_percentage: 0,
    total_invested: 0,
    email: '',
    phone: '',
  });
  const [investmentData, setInvestmentData] = useState({
    amount: 0,
    investment_date: new Date().toISOString().split('T')[0],
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: shareholdersData, error: shareholdersError } = await supabase
        .from('shareholders')
        .select('*')
        .order('ownership_percentage', { ascending: false });

      if (shareholdersError) throw shareholdersError;

      // If no shareholders exist, seed with initial data
      if (!shareholdersData || shareholdersData.length === 0) {
        await seedInitialShareholders();
        return;
      }

      setShareholders(shareholdersData);

      const { data: investmentsData, error: investmentsError } = await supabase
        .from('shareholder_investments')
        .select('*')
        .order('investment_date', { ascending: false });

      if (investmentsError) throw investmentsError;
      setInvestments(investmentsData || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load shareholders');
    } finally {
      setLoading(false);
    }
  };

  const seedInitialShareholders = async () => {
    if (!user) return;
    try {
      const shareholdersToInsert = initialShareholders.map(s => ({
        ...s,
        user_id: user.id,
        total_invested: 0,
      }));

      const { error } = await supabase.from('shareholders').insert(shareholdersToInsert);
      if (error) throw error;
      
      toast.success('Initial shareholders created');
      fetchData();
    } catch (error: any) {
      console.error('Error seeding shareholders:', error);
      toast.error('Failed to create initial shareholders');
    }
  };

  const handleAddShareholder = async () => {
    if (!user) return;
    try {
      const { error } = await supabase.from('shareholders').insert({
        ...formData,
        user_id: user.id,
      });

      if (error) throw error;
      toast.success('Shareholder added');
      setIsAddOpen(false);
      setFormData({ name: '', designation: '', ownership_percentage: 0, total_invested: 0, email: '', phone: '' });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add shareholder');
    }
  };

  const handleAddInvestment = async () => {
    if (!user || !selectedShareholder) return;
    try {
      const { error: investError } = await supabase.from('shareholder_investments').insert({
        shareholder_id: selectedShareholder.id,
        user_id: user.id,
        ...investmentData,
      });

      if (investError) throw investError;

      // Update total invested
      const { error: updateError } = await supabase
        .from('shareholders')
        .update({ total_invested: selectedShareholder.total_invested + investmentData.amount })
        .eq('id', selectedShareholder.id);

      if (updateError) throw updateError;

      toast.success('Investment recorded');
      setIsInvestOpen(false);
      setInvestmentData({ amount: 0, investment_date: new Date().toISOString().split('T')[0], description: '' });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to record investment');
    }
  };

  const handleDeleteShareholder = async (id: string) => {
    try {
      const { error } = await supabase.from('shareholders').delete().eq('id', id);
      if (error) throw error;
      toast.success('Shareholder removed');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete shareholder');
    }
  };

  const totalInvestment = shareholders.reduce((sum, s) => sum + (s.total_invested || 0), 0);
  const totalOwnership = shareholders.reduce((sum, s) => sum + s.ownership_percentage, 0);

  const formatCurrency = (amount: number) => `৳${amount.toLocaleString('en-BD')}`;

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Shareholders & Team"
          description="Manage stakeholder profiles and investment tracking"
          icon={Users}
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/20">
                <div className="h-6 w-6 text-primary"><Users className="h-6 w-6" /></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Shareholders</p>
                <p className="text-2xl font-bold">{shareholders.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-success/20">
                <div className="h-6 w-6 text-success"><Banknote className="h-6 w-6" /></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Investment</p>
                <p className="text-2xl font-bold">{formatCurrency(totalInvestment)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-warning/10 to-warning/5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-warning/20">
                <div className="h-6 w-6 text-warning"><Percent className="h-6 w-6" /></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Allocated Ownership</p>
                <p className="text-2xl font-bold">{totalOwnership}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Add Shareholder Button */}
        <div className="flex justify-end">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Shareholder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Shareholder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Designation</Label>
                  <Input
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Ownership %</Label>
                  <Input
                    type="number"
                    value={formData.ownership_percentage}
                    onChange={(e) => setFormData({ ...formData, ownership_percentage: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddShareholder} className="w-full">Add Shareholder</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Shareholders Grid */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shareholders.map((shareholder) => {
              const shareholderInvestments = investments.filter(i => i.shareholder_id === shareholder.id);
              
              return (
                <Card key={shareholder.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg">
                        {shareholder.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{shareholder.name}</h3>
                        <p className="text-sm text-muted-foreground">{shareholder.designation}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedShareholder(shareholder);
                          setIsInvestOpen(true);
                        }}
                      >
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteShareholder(shareholder.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Ownership</span>
                      <span className="font-bold text-primary">{shareholder.ownership_percentage}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                      <span className="text-sm text-muted-foreground">Total Invested</span>
                      <span className="font-bold text-success">{formatCurrency(shareholder.total_invested || 0)}</span>
                    </div>
                  </div>

                  {shareholderInvestments.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Investment Timeline</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {shareholderInvestments.slice(0, 3).map((inv) => (
                          <div key={inv.id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{new Date(inv.investment_date).toLocaleDateString()}</span>
                            <span className="font-medium">{formatCurrency(inv.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* Add Investment Dialog */}
        <Dialog open={isInvestOpen} onOpenChange={setIsInvestOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Investment for {selectedShareholder?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Amount (৳)</Label>
                <Input
                  type="number"
                  value={investmentData.amount}
                  onChange={(e) => setInvestmentData({ ...investmentData, amount: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={investmentData.investment_date}
                  onChange={(e) => setInvestmentData({ ...investmentData, investment_date: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={investmentData.description}
                  onChange={(e) => setInvestmentData({ ...investmentData, description: e.target.value })}
                  placeholder="Optional note"
                />
              </div>
              <Button onClick={handleAddInvestment} className="w-full">Record Investment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
