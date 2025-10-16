import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Transaction } from '@/hooks/useTransactions';

interface UpcomingExpensesProps {
  expenses: Transaction[];
}

const UpcomingExpenses: React.FC<UpcomingExpensesProps> = ({ expenses }) => {
  if (expenses.length === 0) {
    return null;
  }

  return (
    <div className="p-5 bg-yellow-50 border border-yellow-300 rounded-xl mb-8 dark:bg-yellow-900/20 dark:border-yellow-700/50">
      <div className="flex items-center">
        <AlertCircle className="text-yellow-500 dark:text-yellow-400 mr-3" />
        <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200">Alertas de Vencimento</h3>
      </div>
      <ul className="mt-2 ml-8 list-disc list-outside text-yellow-700 dark:text-yellow-300 space-y-1">
        {expenses.map(exp => (
          <li key={exp.id}>
            <strong>{exp.description}</strong> ({exp.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})
            - Vence em {exp.date.toDate().toLocaleDateString('pt-BR')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingExpenses;