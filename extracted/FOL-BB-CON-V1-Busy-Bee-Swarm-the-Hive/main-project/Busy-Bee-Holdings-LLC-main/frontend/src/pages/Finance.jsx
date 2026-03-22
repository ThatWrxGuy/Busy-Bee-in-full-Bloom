/**
 * Busy Bee Finance Dashboard - Design System Implementation
 * Income, expenses, savings, and investments tracking
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrendingUp, FiTrendingDown, FiDollarSign, FiCreditCard, FiPieChart, FiTarget, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import {
  PageContainer,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Progress,
  Grid,
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../components';

// ─── Mock Data - EXAMPLES ONLY for users to reference ───────────────────────────
// In production, this would be empty or fetched from user's personal data
// These examples show the types of finance data users might track

const mockStats = [
  { label: 'Net Worth', value: '$12,543', trend: 3.2, icon: FiDollarSign },
  { label: 'Monthly Income', value: '$8,500', trend: 5, icon: FiArrowUpRight },
  { label: 'Monthly Expenses', value: '$4,230', trend: -2, icon: FiArrowDownRight },
  { label: 'Savings Rate', value: '50%', trend: 8, icon: FiTrendingUp },
];

const mockAccounts = [
  { id: 1, name: 'Chase Checking', balance: 4520.0, type: 'checking', emoji: '🏦' },
  { id: 2, name: 'Chase Savings', balance: 8023.67, type: 'savings', emoji: '💰' },
  { id: 3, name: 'Investment Account', balance: 15000.0, type: 'investment', emoji: '📈' },
  { id: 4, name: 'Credit Card', balance: -1234.56, type: 'credit', emoji: '💳' },
];

const mockTransactions = [
  { id: 1, date: 'Today', merchant: 'Whole Foods', amount: 156.32, category: 'Food', type: 'expense' },
  { id: 2, date: 'Today', merchant: 'Salary Deposit', amount: 4250.0, category: 'Income', type: 'income' },
  { id: 3, date: 'Yesterday', merchant: 'Uber', amount: 24.5, category: 'Transport', type: 'expense' },
  { id: 4, date: 'Yesterday', merchant: 'Netflix', amount: 15.99, category: 'Entertainment', type: 'expense' },
  { id: 5, date: 'Jan 20', merchant: 'Electric Co', amount: 145.0, category: 'Utilities', type: 'expense' },
  { id: 6, date: 'Jan 18', merchant: 'Rent', amount: 1800.0, category: 'Housing', type: 'expense' },
  { id: 7, date: 'Jan 15', merchant: 'Freelance', amount: 1500.0, category: 'Income', type: 'income' },
  { id: 8, date: 'Jan 12', merchant: 'Gas Station', amount: 65.0, category: 'Transport', type: 'expense' },
];

const mockGoals = [
  { id: 1, title: 'Emergency Fund ($10K)', progress: 80, status: 'active', target: '$8,000' },
  { id: 2, title: 'Retirement Savings', progress: 25, status: 'active', target: '25/100%' },
  { id: 3, title: 'Pay off credit card', progress: 60, status: 'active', target: '$1,235 left' },
  { id: 4, title: 'Vacation Fund', progress: 100, status: 'completed', target: '$3,000' },
];

const mockSpendingByCategory = [
  { category: 'Housing', amount: 1800, percentage: 42, icon: '🏠' },
  { category: 'Food', amount: 890, percentage: 21, icon: '🍔' },
  { category: 'Transport', amount: 450, percentage: 11, icon: '🚗' },
  { category: 'Utilities', amount: 320, percentage: 8, icon: '💡' },
  { category: 'Entertainment', amount: 270, percentage: 6, icon: '🎬' },
  { category: 'Shopping', amount: 250, percentage: 6, icon: '🛍️' },
  { category: 'Healthcare', amount: 150, percentage: 4, icon: '🏥' },
  { category: 'Other', amount: 100, percentage: 2, icon: '📦' },
];

const mockInsights = [
  { label: 'Spending vs last month', value: '-12%', icon: FiTrendingDown },
  { label: 'Savings this month', value: '$4,270', icon: FiDollarSign },
  { label: 'Biggest expense', value: 'Housing (42%)', icon: FiPieChart },
  { label: 'Daily average', value: '$141/day', icon: FiChart },
];

const mockBudgets = [
  { category: 'Housing', budget: 2000, spent: 1800, icon: '🏠' },
  { category: 'Food', budget: 600, spent: 890, icon: '🍔', over: true },
  { category: 'Transport', budget: 300, spent: 450, icon: '🚗', over: true },
  { category: 'Entertainment', budget: 200, spent: 150, icon: '🎬', over: false },
  { category: 'Shopping', budget: 300, spent: 250, icon: '🛍️', over: false },
];

// ─── Components ───────────────────────────────────────────────────────────────

function StatCardNew({ icon: Icon, label, value, trend, loading }) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-20 mb-3" />
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-24" />
        </CardContent>
      </Card>
    );
  }

  const isPositive = trend > 0;
  const isNegative = trend < 0;

  return (
    <Card hover className="cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <Icon className="w-5 h-5 text-green-500" />
          </div>
          {trend != null && (
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              {isPositive && <FiTrendingUp size={14} />}
              {isNegative && <FiTrendingDown size={14} />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

function GoalCard({ goal }) {
  const statusColors = { active: 'success', completed: 'info', paused: 'secondary' };
  return (
    <Card hover className="cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-medium text-gray-900 flex-1 line-clamp-1">{goal.title}</h3>
          <Badge variant={statusColors[goal.status]}>{goal.status}</Badge>
        </div>
        <Progress value={goal.progress} className="h-2 mb-3" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{goal.progress}% complete</span>
          <span className="text-xs text-gray-400">{goal.target}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function AccountCard({ account }) {
  const typeColors = {
    checking: 'bg-blue-100 text-blue-700',
    savings: 'bg-green-100 text-green-700',
    investment: 'bg-purple-100 text-purple-700',
    credit: 'bg-red-100 text-red-700',
  };

  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{account.emoji}</span>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{account.name}</h3>
            <p className="text-xs text-gray-500 capitalize">{account.type}</p>
          </div>
          <span className={`text-lg font-bold ${account.balance >= 0 ? 'text-gray-900' : 'text-red-500'}`}>
            ${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function TransactionCard({ transaction }) {
  const categoryIcons = {
    Food: '🍔',
    Transport: '🚗',
    Entertainment: '🎬',
    Utilities: '💡',
    Housing: '🏠',
    Income: '💰',
    Shopping: '🛍️',
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-xl">{categoryIcons[transaction.category] || '📦'}</span>
        <div>
          <p className="font-medium text-gray-900">{transaction.merchant}</p>
          <p className="text-xs text-gray-500">{transaction.date} • {transaction.category}</p>
        </div>
      </div>
      <span className={`font-medium ${transaction.type === 'income' ? 'text-green-500' : 'text-gray-900'}`}>
        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
      </span>
    </div>
  );
}

function CategoryCard({ category }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{category.icon}</span>
          <span className="font-medium text-gray-900">{category.category}</span>
        </div>
        <div className="text-right">
          <p className="font-semibold">${category.amount.toLocaleString()}</p>
          <p className="text-xs text-gray-500">{category.percentage}%</p>
        </div>
      </div>
      <Progress value={category.percentage} className="h-2" />
    </div>
  );
}

function BudgetCard({ budget }) {
  const percentage = (budget.spent / budget.budget) * 100;
  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{budget.icon}</span>
            <span className="font-medium text-gray-900">{budget.category}</span>
          </div>
          {budget.over && <Badge variant="destructive">Over</Badge>}
        </div>
        <Progress value={Math.min(percentage, 100)} className={`h-2 mb-2 ${budget.over ? '[&>div]:bg-red-500' : ''}`} />
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">${budget.spent} spent</span>
          <span className="text-gray-400">${budget.budget} budget</span>
        </div>
      </CardContent>
    </Card>
  );
}

function InsightCard({ insight }) {
  const Icon = insight.icon;
  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-100">
            <Icon className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">{insight.label}</p>
            <p className="font-medium text-gray-900">{insight.value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Finance Dashboard ───────────────────────────────────────────────────

function Finance() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageContainer
      title="Finance Dashboard"
      subtitle="Track your income, expenses, and financial goals"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FiPlus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
          <Button size="sm">
            <FiPlus className="w-4 h-4 mr-2" />
            Link Account
          </Button>
        </div>
      }
    >
      {/* Stats Grid */}
      <Grid cols={{ default: 1, sm: 2, lg: 4 }} className="mb-6">
        {mockStats.map((stat, index) => (
          <StatCardNew key={index} {...stat} loading={loading} />
        ))}
      </Grid>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Spending by Category */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader title="Spending by Category" />
                <CardContent className="space-y-4">
                  {mockSpendingByCategory.map((cat) => (
                    <CategoryCard key={cat.category} category={cat} />
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader title="Accounts" />
                <CardContent className="space-y-3">
                  {mockAccounts.map((account) => (
                    <AccountCard key={account.id} account={account} />
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Quick Insights" />
                <CardContent className="space-y-3">
                  {mockInsights.slice(0, 2).map((insight, idx) => (
                    <InsightCard key={idx} insight={insight} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader 
              title="Recent Transactions" 
              action={
                <Button size="sm">
                  <FiPlus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              }
            />
            <CardContent className="space-y-2">
              {loading ? (
                <>
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </>
              ) : (
                mockTransactions.map((tx) => <TransactionCard key={tx.id} transaction={tx} />)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets">
          <Card>
            <CardHeader title="Monthly Budgets" />
            <CardContent>
              <Grid cols={{ default: 1, md: 2 }} className="gap-4">
                {mockBudgets.map((budget, idx) => (
                  <BudgetCard key={idx} budget={budget} />
                ))}
              </Grid>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader 
                  title="Financial Goals" 
                  action={
                    <Link to="/goals" className="text-sm text-green-600 hover:underline">
                      View all →
                    </Link>
                  }
                />
                <CardContent className="space-y-4">
                  {mockGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader title="All Insights" />
                <CardContent className="space-y-3">
                  {mockInsights.map((insight, idx) => (
                    <InsightCard key={idx} insight={insight} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

export default Finance;
