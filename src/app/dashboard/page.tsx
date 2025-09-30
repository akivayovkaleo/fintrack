// src/app/dashboard/page.tsx

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
} from 'chart.js';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
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

// Interfaces para os dados das APIs
interface ApiQuotes {
  dollar: string | null;
  ibovespa: number | null;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const [quotes, setQuotes] = useState<ApiQuotes>({ dollar: null, ibovespa: null });

  // Redireciona se o usuário não estiver logado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Busca os dados das APIs externas quando o componente monta
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        // AwesomeAPI para Dólar (não precisa de chave)
        const dollarRes = await axios.get('https://economia.awesomeapi.com.br/json/last/USD-BRL');
        const formattedDollar = parseFloat(dollarRes.data.USDBRL.bid).toFixed(2);

        // Brapi para Ibovespa (usando a chave do .env.local)
        const ibovRes = await axios.get(`https://brapi.dev/api/quote/^BVSP?token=${process.env.NEXT_PUBLIC_BRAPI_API_KEY}`);
        const ibovValue = ibovRes.data.results[0].regularMarketPrice;
        
        setQuotes({ dollar: `R$ ${formattedDollar}`, ibovespa: ibovValue });
      } catch (error) {
        console.error("Erro ao buscar cotações:", error);
        // Não mostra erro para o usuário, apenas falha silenciosamente
      }
    };
    fetchQuotes();
  }, []);

  // Calcula os totais e dados para os gráficos
  // O useMemo evita recálculos desnecessários a cada renderização
  const financialData = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    const balance = income - expenses;

    // Dados para o gráfico de despesas por categoria
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
    
    const chartLabels = Object.keys(expensesByCategory);
    const chartDataValues = Object.values(expensesByCategory);

    // Alertas de contas a vencer
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

  // Opções para o gráfico
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Despesas por Categoria' },
    },
  };

  const chartData = {
    labels: financialData.chartLabels,
    datasets: [
      {
        label: 'Valor Gasto',
        data: financialData.chartDataValues,
        backgroundColor: 'rgba(200, 0, 200, 0.6)', // Cor primária com transparência
      },
    ],
  };

  if (authLoading || transactionsLoading) {
    return <div className="text-center mt-10">Carregando dados...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Olá, {user?.displayName || 'Usuário'}!</h1>
      
      {/* Cards de Cotações e Balanço */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Cotações */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="font-semibold text-gray-500">Dólar (USD)</h3>
          <p className="text-2xl font-bold">{quotes.dollar || 'Carregando...'}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="font-semibold text-gray-500">Ibovespa</h3>
          <p className="text-2xl font-bold">{quotes.ibovespa || 'Carregando...'}</p>
        </div>
        {/* Balanço */}
        <div className="p-6 bg-white rounded-lg shadow col-span-1 md:col-span-2 lg:col-span-2 grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
                <TrendingUp className="text-green-500" size={24}/>
                <div>
                    <h3 className="font-semibold text-gray-500">Receitas</h3>
                    <p className="text-xl font-bold text-green-500">{financialData.income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <TrendingDown className="text-red-500" size={24}/>
                <div>
                    <h3 className="font-semibold text-gray-500">Despesas</h3>
                    <p className="text-xl font-bold text-red-500">{financialData.expenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <DollarSign className="text-blue-500" size={24}/>
                <div>
                    <h3 className="font-semibold text-gray-500">Saldo</h3>
                    <p className="text-xl font-bold text-blue-500">{financialData.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Alertas de Vencimento */}
      {financialData.upcomingExpenses.length > 0 && (
        <div className="p-6 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg shadow">
          <div className="flex items-center">
            <AlertCircle className="text-yellow-600 mr-3" />
            <h3 className="text-xl font-bold text-yellow-800">Alertas de Vencimento</h3>
          </div>
          <ul className="mt-2 list-disc list-inside text-yellow-700">
            {financialData.upcomingExpenses.map(exp => (
              <li key={exp.id}>
                <strong>{exp.description}</strong> - Vence em {exp.date.toDate().toLocaleDateString('pt-BR')}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gráfico */}
      <div className="p-6 bg-white rounded-lg shadow">
        {transactions.filter(t => t.type === 'expense').length > 0 ? (
          <Bar options={chartOptions} data={chartData} />
        ) : (
          <p className="text-center text-gray-500">Nenhuma despesa registrada para exibir o gráfico.</p>
        )}
      </div>
    </div>
  );
}