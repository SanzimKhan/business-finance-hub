import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFinance } from '@/context/FinanceContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Target,
  Clock,
  Shield,
  Sparkles,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface Predictions {
  sixMonthGrowth?: { percentage: number; trend: string; analysis: string };
  profitLoss?: { expected: number; confidence: string; factors: string[] };
  burnRate?: { monthly: number; trend: string };
  cashRunway?: { months: number; recommendation: string };
  marketOpportunities?: string[];
  riskAssessment?: { level: string; risks: string[] };
  summary?: string;
}

export default function PredictionsPage() {
  const { getSummary, transactions } = useFinance();
  const [predictions, setPredictions] = useState<Predictions | null>(null);
  const [loading, setLoading] = useState(false);

  const summary = getSummary();

  const generatePredictions = async () => {
    setLoading(true);
    try {
      const financialData = {
        totalIncome: summary.totalIncome,
        totalExpenses: summary.totalExpense,
        netCashflow: summary.profit,
        monthlyIncome: summary.monthlyIncome,
        monthlyExpense: summary.monthlyExpense,
        monthlyProfit: summary.monthlyIncome - summary.monthlyExpense,
        categoryBreakdown: {
          rent: summary.rentTotal,
          salary: summary.salaryTotal,
          marketing: summary.marketingTotal,
          utilities: summary.utilitiesTotal,
          courses: summary.coursesRevenue,
        },
        recentTransactions: transactions.slice(0, 20).map(t => ({
          type: t.type,
          category: t.category,
          amount: t.amount,
          date: t.date,
        })),
      };

      const { data, error } = await supabase.functions.invoke('ai-predictions', {
        body: { financialData },
      });

      if (error) throw error;
      
      setPredictions(data.predictions);
      toast.success('Predictions generated successfully');
    } catch (error: any) {
      console.error('Error generating predictions:', error);
      toast.error(error.message || 'Failed to generate predictions');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => `৳${amount?.toLocaleString('en-BD') || 0}`;

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-5 w-5 text-success" />;
    if (trend === 'down') return <TrendingDown className="h-5 w-5 text-destructive" />;
    return <Target className="h-5 w-5 text-muted-foreground" />;
  };

  // Chart data
  const cashflowData = [
    { name: 'Income', value: summary.totalIncome, fill: 'hsl(var(--success))' },
    { name: 'Expenses', value: summary.totalExpense, fill: 'hsl(var(--destructive))' },
  ];

  const monthlyData = [
    { name: 'This Month', income: summary.monthlyIncome, expenses: summary.monthlyExpense },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="AI Predictions & Insights"
          description="LLM-powered financial forecasting and business intelligence"
          icon={BrainCircuit}
        />

        {/* Current Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-success/20">
                <div className="h-6 w-6 text-success"><TrendingUp className="h-6 w-6" /></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold text-success">{formatCurrency(summary.totalIncome)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-destructive/20">
                <div className="h-6 w-6 text-destructive"><TrendingDown className="h-6 w-6" /></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-destructive">{formatCurrency(summary.totalExpense)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <div className="h-6 w-6 text-primary"><Target className="h-6 w-6" /></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net Cashflow</p>
                <p className={`text-2xl font-bold ${summary.profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(summary.profit)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Generate Predictions Button */}
        <div className="flex justify-center">
          <Button 
            size="lg" 
            onClick={generatePredictions} 
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
            {loading ? 'Analyzing...' : 'Generate AI Predictions'}
          </Button>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Income vs Expenses</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={cashflowData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cashflowData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Monthly Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="income" name="Income" fill="hsl(var(--success))" />
                <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--destructive))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* AI Predictions */}
        {predictions && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BrainCircuit className="h-6 w-6" />
              AI-Generated Insights
            </h2>

            {/* Summary */}
            {predictions.summary && (
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
                <p className="text-lg leading-relaxed">{predictions.summary}</p>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 6-Month Growth */}
              {predictions.sixMonthGrowth && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    {getTrendIcon(predictions.sixMonthGrowth.trend)}
                    <h3 className="font-semibold">6-Month Growth Forecast</h3>
                  </div>
                  <p className={`text-3xl font-bold mb-2 ${predictions.sixMonthGrowth.percentage >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {predictions.sixMonthGrowth.percentage > 0 ? '+' : ''}{predictions.sixMonthGrowth.percentage}%
                  </p>
                  <p className="text-sm text-muted-foreground">{predictions.sixMonthGrowth.analysis}</p>
                </Card>
              )}

              {/* Profit/Loss Prediction */}
              {predictions.profitLoss && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5" />
                    <h3 className="font-semibold">Expected Profit/Loss</h3>
                  </div>
                  <p className={`text-3xl font-bold mb-2 ${predictions.profitLoss.expected >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatCurrency(predictions.profitLoss.expected)}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Confidence: <span className="font-medium">{predictions.profitLoss.confidence}</span>
                  </p>
                  {predictions.profitLoss.factors && (
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {predictions.profitLoss.factors.map((factor, i) => (
                        <li key={i}>• {factor}</li>
                      ))}
                    </ul>
                  )}
                </Card>
              )}

              {/* Burn Rate */}
              {predictions.burnRate && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5" />
                    <h3 className="font-semibold">Monthly Burn Rate</h3>
                  </div>
                  <p className="text-3xl font-bold text-destructive mb-2">
                    {formatCurrency(predictions.burnRate.monthly)}
                  </p>
                  <p className="text-sm text-muted-foreground">{predictions.burnRate.trend}</p>
                </Card>
              )}

              {/* Cash Runway */}
              {predictions.cashRunway && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5" />
                    <h3 className="font-semibold">Cash Runway</h3>
                  </div>
                  <p className="text-3xl font-bold mb-2">
                    {predictions.cashRunway.months} months
                  </p>
                  <p className="text-sm text-muted-foreground">{predictions.cashRunway.recommendation}</p>
                </Card>
              )}

              {/* Risk Assessment */}
              {predictions.riskAssessment && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5" />
                    <h3 className="font-semibold">Risk Assessment</h3>
                  </div>
                  <p className={`text-3xl font-bold mb-2 ${getRiskColor(predictions.riskAssessment.level)}`}>
                    {predictions.riskAssessment.level?.toUpperCase()}
                  </p>
                  {predictions.riskAssessment.risks && (
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {predictions.riskAssessment.risks.map((risk, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 mt-0.5 text-warning shrink-0" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              )}

              {/* Market Opportunities */}
              {predictions.marketOpportunities && predictions.marketOpportunities.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="h-5 w-5 text-warning" />
                    <h3 className="font-semibold">Market Opportunities</h3>
                  </div>
                  <ul className="space-y-2">
                    {predictions.marketOpportunities.map((opp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Sparkles className="h-4 w-4 mt-0.5 text-success shrink-0" />
                        {opp}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          </div>
        )}

        {!predictions && !loading && (
          <Card className="p-12 text-center">
            <BrainCircuit className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground mb-2">No predictions generated yet</p>
            <p className="text-sm text-muted-foreground">
              Click the button above to analyze your financial data and get AI-powered insights
            </p>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
