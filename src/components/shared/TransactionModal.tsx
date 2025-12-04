import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFinance } from '@/context/FinanceContext';
import { CategoryType, TransactionType } from '@/types/finance';
import { toast } from 'sonner';
import { Plus, Minus } from 'lucide-react';

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: TransactionType;
  defaultCategory?: CategoryType;
  title?: string;
}

const categories: { value: CategoryType; label: string }[] = [
  { value: 'rent', label: 'Rent' },
  { value: 'salary', label: 'Salary' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'general', label: 'General' },
  { value: 'stock', label: 'Components Stock' },
  { value: '3d-printing', label: '3D Printing' },
  { value: 'courses', label: 'Courses' },
  { value: 'school', label: 'School/Kids Program' },
  { value: 'projects', label: 'Personal Projects' },
  { value: 'other', label: 'Other' },
];

export function TransactionModal({
  open,
  onOpenChange,
  defaultType = 'expense',
  defaultCategory = 'general',
  title,
}: TransactionModalProps) {
  const { addTransaction } = useFinance();
  const [type, setType] = useState<TransactionType>(defaultType);
  const [category, setCategory] = useState<CategoryType>(defaultCategory);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    addTransaction({
      type,
      category,
      amount: parseFloat(amount),
      description,
      date,
    });

    toast.success(`${type === 'income' ? 'Income' : 'Expense'} added successfully`);
    
    // Reset form
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {title || `Add ${type === 'income' ? 'Income' : 'Expense'}`}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type Toggle */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={type === 'income' ? 'income' : 'outline'}
              className="flex-1"
              onClick={() => setType('income')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Income
            </Button>
            <Button
              type="button"
              variant={type === 'expense' ? 'expense' : 'outline'}
              className="flex-1"
              onClick={() => setType('expense')}
            >
              <Minus className="mr-2 h-4 w-4" />
              Expense
            </Button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (৳)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg font-semibold"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as CategoryType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant={type === 'income' ? 'income' : 'expense'}
            className="w-full"
          >
            Add {type === 'income' ? 'Income' : 'Expense'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
