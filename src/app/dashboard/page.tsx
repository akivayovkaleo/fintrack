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
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Landmark } from 'lucide-react';
import axios from 'axios';

// Registra os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Interfaces para os dados
interface ApiQuotes {
  dollar: string | null;
  ibovespa: string | null;
}

// Componente para um Card genérico do Dashboard
const DashboardCard = ({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) => (
  <div className={`bg-background-secondary p-6 rounded-lg border border-border ${className}`}>
    <h3 className="text-sm font-medium text-text-secondary mb-2">{title}</h3>
    {children}
  </div>
);

// Componente para o esqueleto de carregamento (loading skeleton)
const SkeletonLoader = () => (
  <div className="space-y-8 animate-pulse">
    <div className="h-9 w-1/2 rounded-md bg-background-secondary"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="h-24 rounded-lg bg-background-secondary"></div>
      <div className="h-24 rounded-lg bg-background-secondary"></div>
      <div className="h-24 col-span-1 md:col-span-2 rounded-lg bg-background-secondary"></div>
    </div>
    <div className="h-96 rounded-lg bg-background-secondary"></div>
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
          axios.get(`https://brapi.dev/api/quote/^BVSP?token=${process.env.NEXT_PUBLIC_BRAPI_API_KEY}`)
        ]);
        
        const formattedDollar = `R$ ${parseFloat(dollarRes.data.USDBRL.bid).toFixed(2)}`;
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

  // Configurações do gráfico com tema escuro
  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: { color: '#A7A7A7' }
      },
      title: { 
        display: true, 
        text: 'Despesas por Categoria',
        color: '#FFFFFF',
        font: { size: 18 }
      },
      tooltip: {
        backgroundColor: '#111111',
        titleColor: '#FFFFFF',
        bodyColor: '#A7A7A7',
      }
    },
    scales: {
      x: {
        ticks: { color: '#A7A7A7' },
        grid: { color: '#222222' }
      },
      y: {
        ticks: { color: '#A7A7A7' },
        grid: { color: '#222222' }
      }
    }
  };

  const chartData = {
    labels: financialData.chartLabels,
    datasets: [
      {
        label: 'Valor Gasto (R$)',
        data: financialData.chartDataValues,
        backgroundColor: '#C800C8',
        borderColor: '#A000A0',
        borderRadius: 4,
        borderWidth: 1,
      },
    ],
  };

  // Exibe o esqueleto de carregamento enquanto os dados não chegam
  if (authLoading || transactionsLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-text-primary">Bem-vindo(a), {user?.displayName || 'Usuário'}!</h1>
      
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Dólar (USD)">
          <p className="text-2xl font-bold text-text-primary">{quotes.dollar || '...'}</p>
        </DashboardCard>
        <DashboardCard title="Ibovespa">
          <p className="text-2xl font-bold text-text-primary">{quotes.ibovespa || '...'}</p>
        </DashboardCard>
        
        <DashboardCard title="Balanço Financeiro" className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500/10 rounded-full"><TrendingUp className="text-green-500" size={20}/></div>
                    <div>
                        <p className="text-sm text-text-secondary">Receitas</p>
                        <p className="text-lg font-bold text-green-500">{financialData.income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    </div>
                 </div>
                 <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-500/10 rounded-full"><TrendingDown className="text-red-500" size={20}/></div>
                    <div>
                        <p className="text-sm text-text-secondary">Despesas</p>
                        <p className="text-lg font-bold text-red-500">{financialData.expenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    </div>
                 </div>
                 <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/10 rounded-full"><Landmark className="text-blue-500" size={20}/></div>
                    <div>
                        <p className="text-sm text-text-secondary">Saldo</p>
                        <p className="text-lg font-bold text-blue-500">{financialData.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    </div>
                 </div>
            </div>
        </DashboardCard>
      </div>

      {/* Alertas de Vencimento */}
      {financialData.upcomingExpenses.length > 0 && (
        <div className="p-5 bg-yellow-500/10 border-l-4 border-yellow-500 rounded-r-lg">
          <div className="flex items-center">
            <AlertCircle className="text-yellow-500 mr-3" />
            <h3 className="text-lg font-bold text-yellow-400">Alertas de Vencimento</h3>
          </div>
          <ul className="mt-2 ml-8 list-disc list-outside text-yellow-300/80 space-y-1">
            {financialData.upcomingExpenses.map(exp => (
              <li key={exp.id}>
                <strong>{exp.description}</strong> ({exp.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}) - Vence em {exp.date.toDate().toLocaleDateString('pt-BR')}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gráfico */}
      <DashboardCard title="">
        <div className="h-96">
          {transactions.filter(t => t.type === 'expense').length > 0 ? (
            <Bar options={chartOptions} data={chartData} />
          ) : (
            <div className="flex items-center justify-center h-full">
                <p className="text-center text-text-secondary">Nenhuma despesa registrada para exibir o gráfico.</p>
            </div>
          )}
        </div>
      </DashboardCard>
    </div>
  );
}