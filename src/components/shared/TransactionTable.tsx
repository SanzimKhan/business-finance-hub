import { Transaction } from '@/types/finance';
import { useFinance } from '@/context/FinanceContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TransactionTableProps {
  transactions: Transaction[];
  showCategory?: boolean;
}

const categoryLabels: Record<string, string> = {
  rent: 'Rent',
  salary: 'Salary',
  marketing: 'Marketing',
  general: 'General',
  stock: 'Stock',
  '3d-printing': '3D Print',
  courses: 'Courses',
  school: 'School',
  projects: 'Projects',
  other: 'Other',
};

export function TransactionTable({ transactions, showCategory = true }: TransactionTableProps) {
  const { deleteTransaction } = useFinance();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    toast.success('Transaction deleted');
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-lg">No transactions yet</p>
        <p className="text-sm">Add your first transaction to get started</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[100px]">Type</TableHead>
            {showCategory && <TableHead>Category</TableHead>}
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow 
              key={transaction.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TableCell>
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg',
                  transaction.type === 'income' ? 'bg-income-bg' : 'bg-expense-bg'
                )}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="h-4 w-4 text-income" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-expense" />
                  )}
                </div>
              </TableCell>
              {showCategory && (
                <TableCell>
                  <Badge variant="secondary" className="font-normal">
                    {categoryLabels[transaction.category]}
                  </Badge>
                </TableCell>
              )}
              <TableCell className="font-medium">
                {transaction.description || 'No description'}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(transaction.date)}
              </TableCell>
              <TableCell className={cn(
                'text-right font-semibold',
                transaction.type === 'income' ? 'text-income' : 'text-expense'
              )}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(transaction.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
