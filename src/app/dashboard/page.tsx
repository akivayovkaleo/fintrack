'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useTransactions } from '@/hooks/useTransactions';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Landmark, Briefcase, Activity } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

// Registo dos componentes do Chart.js
ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend );

// Interfaces para os dados
interface ApiQuotes {
  dollar: string | null;
  ibovespa: string | null;
}

// Componente para um Card genérico do Dashboard
const DashboardCard = ({ title, icon, children, className = '' }: { title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }) => (
  <div className={`bg-white p-6 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:border-[#C800C8] transition-all duration-300 ${className}`}>
    <div className="flex items-center gap-4 mb-4">
      <div className="text-[#C800C8]">{icon}</div>
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
    </div>
    {children}
  </div>
);

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
  const [quotes, setQuotes] = useState<ApiQuotes>({ dollar: null, ibovespa: null });

  // Redireciona se não estiver logado
  useEffect(() => {
    if (!authLoading && !user) {
        router.push('/login');
    }
  }, [user, authLoading, router]);

  // Busca cotações das APIs
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const [dollarRes, ibovRes] = await Promise.all([
          axios.get('https://economia.awesomeapi.com.br/json/last/USD-BRL'),
          axios.get(`https://brapi.dev/api/quote/^BVSP?token=x8dxZ4L5awTkaHhRKLU2Gf`)
        ]);
        
        const formattedDollar = `${parseFloat(dollarRes.data.USDBRL.bid).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
        const ibovValue = `${ibovRes.data.results[0].regularMarketPrice.toLocaleString('pt-BR')} pts`;

        setQuotes({ dollar: formattedDollar, ibovespa: ibovValue });
      } catch (error) {
        console.error("Erro ao buscar cotações:", error);
        setQuotes({ dollar: 'Erro', ibovespa: 'Erro' });
      }
    };
    if (user) {
        fetchQuotes();
    }
  }, [user]);

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
  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Despesas por Categoria', color: '#111827', font: { size: 18, weight: 'bold' } },
      tooltip: { backgroundColor: '#FFFFFF', titleColor: '#111827', bodyColor: '#4B5563', borderColor: '#E5E7EB', borderWidth: 1, }
    },
    scales: {
      x: { ticks: { color: '#6B7280' }, grid: { display: false } },
      y: { ticks: { color: '#6B7280' }, grid: { color: '#E5E7EB' } }
    }
  };

  const chartData = {
    labels: financialData.chartLabels,
    datasets: [
      {
        label: 'Valor Gasto (R$)',
        data: financialData.chartDataValues,
        backgroundColor: 'rgba(200, 0, 200, 0.8)',
        borderColor: 'rgba(200, 0, 200, 1)',
        borderRadius: 6,
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(200, 0, 200, 1)',
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <DashboardCard title="Dólar (USD)" icon={<DollarSign size={24}/>}>
                    <p className="text-3xl font-bold">{quotes.dollar || '...'}</p>
                </DashboardCard>
                <DashboardCard title="Ibovespa" icon={<Activity size={24}/>}>
                    <p className="text-3xl font-bold">{quotes.ibovespa || '...'}</p>
                </DashboardCard>
                
                <DashboardCard title="Balanço Financeiro" icon={<Briefcase size={24}/>} className="md:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center md:text-left">
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2"><TrendingUp className="text-green-500" size={20}/><p className="text-sm text-gray-500">Receitas</p></div>
                            <p className="text-xl font-bold text-green-600">{financialData.income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2"><TrendingDown className="text-red-500" size={20}/><p className="text-sm text-gray-500">Despesas</p></div>
                            <p className="text-xl font-bold text-red-600">{financialData.expenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2"><Landmark className="text-blue-500" size={20}/><p className="text-sm text-gray-500">Saldo</p></div>
                            <p className="text-xl font-bold text-blue-600">{financialData.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                    </div>
                </DashboardCard>
            </div>

            {financialData.upcomingExpenses.length > 0 && (
                <div className="p-5 bg-yellow-50 border border-yellow-300 rounded-xl mb-8">
                    <div className="flex items-center"><AlertCircle className="text-yellow-500 mr-3" /><h3 className="text-lg font-bold text-yellow-800">Alertas de Vencimento</h3></div>
                    <ul className="mt-2 ml-8 list-disc list-outside text-yellow-700 space-y-1">
                        {financialData.upcomingExpenses.map(exp => (
                        <li key={exp.id}><strong>{exp.description}</strong> ({exp.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}) - Vence em {exp.date.toDate().toLocaleDateString('pt-BR')}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                <div className="h-96">
                    {transactions.filter(t => t.type === 'expense').length > 0 ? (
                        <Bar options={chartOptions} data={chartData} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <p className="text-gray-500">Nenhuma despesa registada para exibir o gráfico.</p>
                            <p className="text-sm text-gray-400 mt-2">Adicione a sua primeira transação para começar.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}