import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  variant?: 'default' | 'income' | 'expense';
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  className,
  variant = 'default',
}: StatCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    }
    return val;
  };

  return (
    <div
      className={cn(
        'stat-card',
        variant === 'income' && 'border-l-4 border-l-income',
        variant === 'expense' && 'border-l-4 border-l-expense',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p
            className={cn(
              'text-2xl font-bold tracking-tight',
              variant === 'income' && 'text-income',
              variant === 'expense' && 'text-expense'
            )}
          >
            {formatValue(value)}
          </p>
          {trend && trendValue && (
            <div className="flex items-center gap-1 text-sm">
              {trend === 'up' && (
                <>
                  <TrendingUp className="h-4 w-4 text-income" />
                  <span className="text-income">{trendValue}</span>
                </>
              )}
              {trend === 'down' && (
                <>
                  <TrendingDown className="h-4 w-4 text-expense" />
                  <span className="text-expense">{trendValue}</span>
                </>
              )}
              {trend === 'neutral' && (
                <>
                  <Minus className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{trendValue}</span>
                </>
              )}
              <span className="text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            variant === 'income' && 'bg-income-bg text-income',
            variant === 'expense' && 'bg-expense-bg text-expense',
            variant === 'default' && 'bg-secondary text-foreground'
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
