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
import { Package, DollarSign, AlertTriangle, Plus, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function StockPage() {
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [componentModalOpen, setComponentModalOpen] = useState(false);
  const { transactions, components, addComponent, deleteComponent } = useFinance();

  const [newComponent, setNewComponent] = useState({
    name: '',
    quantity: '',
    unitPrice: '',
    minStock: '',
    category: '',
  });

  const stockTransactions = transactions.filter(t => t.category === 'stock');
  const totalValue = components.reduce((sum, c) => sum + (c.quantity * c.unitPrice), 0);
  const lowStockCount = components.filter(c => c.quantity < c.minStock).length;

  const handleAddComponent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComponent.name || !newComponent.quantity || !newComponent.unitPrice) {
      toast.error('Please fill in all required fields');
      return;
    }
    addComponent({
      name: newComponent.name,
      quantity: parseInt(newComponent.quantity),
      unitPrice: parseFloat(newComponent.unitPrice),
      minStock: parseInt(newComponent.minStock) || 5,
      category: newComponent.category || 'General',
    });
    toast.success('Component added successfully');
    setNewComponent({ name: '', quantity: '', unitPrice: '', minStock: '', category: '' });
    setComponentModalOpen(false);
  };

  const handleDeleteComponent = (id: string) => {
    deleteComponent(id);
    toast.success('Component removed');
  };

  const exportInventory = () => {
    const csv = [
      ['Name', 'Category', 'Quantity', 'Unit Price', 'Total Value', 'Min Stock', 'Status'],
      ...components.map(c => [
        c.name,
        c.category,
        c.quantity,
        c.unitPrice.toFixed(2),
        (c.quantity * c.unitPrice).toFixed(2),
        c.minStock,
        c.quantity < c.minStock ? 'Low Stock' : 'OK'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
    toast.success('Inventory exported');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Components Stock"
        description="Manage inventory and track stock levels"
        icon={<Package className="h-6 w-6" />}
        onAddIncome={() => setIncomeModalOpen(true)}
        onAddExpense={() => setExpenseModalOpen(true)}
      >
        <Button variant="outline" onClick={exportInventory}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button variant="outline" onClick={() => setComponentModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Component
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Components"
          value={components.length}
          icon={<Package className="h-5 w-5" />}
        />
        <StatCard
          title="Total Stock Value"
          value={totalValue}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockCount}
          icon={<AlertTriangle className="h-5 w-5" />}
          variant={lowStockCount > 0 ? 'expense' : 'default'}
        />
        <StatCard
          title="Stock Expenses"
          value={stockTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)}
          icon={<Package className="h-5 w-5" />}
          variant="expense"
        />
      </div>

      {/* Components Table */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Inventory</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Component</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {components.map((component) => (
                <TableRow key={component.id}>
                  <TableCell className="font-medium">{component.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{component.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{component.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(component.unitPrice)}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(component.quantity * component.unitPrice)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={component.quantity < component.minStock ? 'destructive' : 'secondary'}
                      className={cn(
                        component.quantity >= component.minStock && 'bg-income-bg text-income'
                      )}
                    >
                      {component.quantity < component.minStock ? 'Low Stock' : 'In Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteComponent(component.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {components.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No components in inventory
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Stock Transactions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Stock Transactions</h2>
        <TransactionTable transactions={stockTransactions} showCategory={false} />
      </div>

      {/* Modals */}
      <TransactionModal
        open={incomeModalOpen}
        onOpenChange={setIncomeModalOpen}
        defaultType="income"
        defaultCategory="stock"
        title="Add Stock-Related Income"
      />
      <TransactionModal
        open={expenseModalOpen}
        onOpenChange={setExpenseModalOpen}
        defaultType="expense"
        defaultCategory="stock"
        title="Add Stock Expense"
      />

      {/* Add Component Modal */}
      <Dialog open={componentModalOpen} onOpenChange={setComponentModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Component</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddComponent} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Component Name</Label>
              <Input
                id="name"
                value={newComponent.name}
                onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newComponent.category}
                onChange={(e) => setNewComponent({ ...newComponent, category: e.target.value })}
                placeholder="e.g., Sensors, Motors..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newComponent.quantity}
                  onChange={(e) => setNewComponent({ ...newComponent, quantity: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price ($)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  value={newComponent.unitPrice}
                  onChange={(e) => setNewComponent({ ...newComponent, unitPrice: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStock">Minimum Stock Level</Label>
              <Input
                id="minStock"
                type="number"
                value={newComponent.minStock}
                onChange={(e) => setNewComponent({ ...newComponent, minStock: e.target.value })}
                placeholder="5"
              />
            </div>
            <Button type="submit" className="w-full">Add Component</Button>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
