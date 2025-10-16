'use client';

import { useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useTransactions } from '@/hooks/useTransactions';
import { useQuotes } from '@/hooks/useQuotes';
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { DollarSign, AlertCircle, Activity } from 'lucide-react';

// Registo dos componentes do Chart.js
ChartJS.register( ArcElement, Title, Tooltip, Legend );

import DashboardCard from '@/components/dashboard/DashboardCard';
import FinancialSummary from '@/components/dashboard/FinancialSummary';
import CategoryChart from '@/components/dashboard/CategoryChart';
import UpcomingExpenses from '@/components/dashboard/UpcomingExpenses';
import RecentTransactions from '@/components/dashboard/RecentTransactions';

// Componente para o esqueleto de carregamento (loading skeleton)
const SkeletonLoader = () => (
    <div className="min-h-screen bg-white p-4 md:p-8">
        <div className="container mx-auto animate-pulse">
            <div className="h-10 w-1/3 rounded-md bg-gray-200 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="h-32 rounded-xl bg-gray-100"></div>
                <div className="h-32 rounded-xl bg-gray-100"></div>
                <div className="h-32 col-span-1 md:col-span-2 rounded-xl bg-gray-100"></div>
            </div>
            <div className="h-96 rounded-xl bg-gray-100"></div>
        </div>
    </div>
);


export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { quotes, loading: quotesLoading, error: quotesError } = useQuotes();

  // Redireciona se não estiver logado
  useEffect(() => {
    if (!authLoading && !user) {
        router.push('/login');
    }
  }, [user, authLoading, router]);

  // Memoriza cálculos financeiros
  const financialData = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expenses;

    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
    
    const chartLabels = Object.keys(expensesByCategory);
    const chartDataValues = Object.values(expensesByCategory);

    const upcomingExpenses = transactions.filter(t => {
      if (t.type === 'expense' && t.status === 'pending') {
        const dueDate = t.date.toDate();
        const today = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(today.getDate() + 7);
        return dueDate >= today && dueDate <= sevenDaysFromNow;
      }
      return false;
    });

    return { income, expenses, balance, chartLabels, chartDataValues, upcomingExpenses };
  }, [transactions]);

  // Configurações do gráfico com tema claro
  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#6B7280',
          boxWidth: 20,
          padding: 20,
        },
      },
      title: { display: true, text: 'Despesas por Categoria', color: '#111827', font: { size: 18, weight: 'bold' } },
      tooltip: {
        backgroundColor: '#FFFFFF',
        titleColor: '#111827',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed);
            }
            return label;
          }
        }
      }
    },
  };

  const chartData = {
    labels: financialData.chartLabels,
    datasets: [
      {
        label: 'Valor Gasto (R$)',
        data: financialData.chartDataValues,
        backgroundColor: [
          '#C800C8',
          '#A000A0',
          '#800080',
          '#600060',
          '#400040',
          '#200020',
        ],
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  if (authLoading || transactionsLoading || !user) {
    return <SkeletonLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
        <div className="container mx-auto p-4 md:p-8">
            <header className="mb-8">
                <p className="text-gray-600">Visão geral</p>
                <h1 className="text-3xl font-bold tracking-tight">
                    Bem-vindo de volta, <span className="text-[#C800C8]">{user.displayName || user.email}</span>!
                </h1>
            </header>
            
            {quotesError && (
                <div className="p-5 bg-red-50 border border-red-300 rounded-xl mb-8">
                    <div className="flex items-center"><AlertCircle className="text-red-500 mr-3" /><h3 className="text-lg font-bold text-red-800">Erro ao Carregar Cotações</h3></div>
                    <p className="mt-2 ml-8 text-red-700">{quotesError}</p>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <DashboardCard title="Dólar (USD)" icon={<DollarSign size={24}/>}>
                    <p className="text-3xl font-bold">{quotes.dollar || '...'}</p>
                </DashboardCard>
                <DashboardCard title="Ibovespa" icon={<Activity size={24}/>}>
                    <p className="text-3xl font-bold">{quotes.ibovespa || '...'}</p>
                </DashboardCard>
                
                <FinancialSummary
                    income={financialData.income}
                    expenses={financialData.expenses}
                    balance={financialData.balance}
                />
            </div>

            <UpcomingExpenses expenses={financialData.upcomingExpenses} />

            <CategoryChart
                chartData={chartData}
                chartOptions={chartOptions}
                hasTransactions={transactions.filter(t => t.type === 'expense').length > 0}
            />

            <RecentTransactions transactions={transactions} />
        </div>
    </div>
  );
}