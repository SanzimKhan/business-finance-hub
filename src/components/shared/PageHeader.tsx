import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  onAddIncome?: () => void;
  onAddExpense?: () => void;
  children?: ReactNode;
}

export function PageHeader({
  title,
  description,
  icon,
  onAddIncome,
  onAddExpense,
  children,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {children}
        {onAddIncome && (
          <Button variant="income" onClick={onAddIncome}>
            <Plus className="mr-2 h-4 w-4" />
            Add Income
          </Button>
        )}
        {onAddExpense && (
          <Button variant="expense" onClick={onAddExpense}>
            <Minus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        )}
      </div>
    </div>
  );
}
