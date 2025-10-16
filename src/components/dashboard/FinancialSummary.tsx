import React from 'react';
import { TrendingUp, TrendingDown, Landmark, Briefcase } from 'lucide-react';
import DashboardCard from './DashboardCard';

interface FinancialSummaryProps {
  income: number;
  expenses: number;
  balance: number;
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ income, expenses, balance }) => {
  return (
    <DashboardCard
      title="Balanço Financeiro"
      icon={<Briefcase size={24} />}
      className="md:col-span-2"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2">
            <TrendingUp className="text-green-500" size={20} />
            <p className="text-sm text-gray-500 dark:text-gray-400">Receitas</p>
          </div>
          <p className="text-xl font-bold text-green-600">
            {income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2">
            <TrendingDown className="text-red-500" size={20} />
            <p className="text-sm text-gray-500 dark:text-gray-400">Despesas</p>
          </div>
          <p className="text-xl font-bold text-red-600">
            {expenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Landmark className="text-blue-500" size={20} />
            <p className="text-sm text-gray-500 dark:text-gray-400">Saldo</p>
          </div>
          <p className="text-xl font-bold text-blue-600">
            {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
      </div>
    </DashboardCard>
  );
};

export default FinancialSummary;