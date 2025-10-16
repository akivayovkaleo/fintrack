import React from 'react';
import { Transaction } from '@/hooks/useTransactions';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Transações Recentes</h3>
        <Link href="/transactions" className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:underline">
          Ver Todas <ArrowRight size={16} />
        </Link>
      </div>
      <div>
        {recentTransactions.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentTransactions.map(t => (
              <li key={t.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{t.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.category}</p>
                </div>
                <div className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'expense' ? '-' : '+'}
                  {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhuma transação recente.</p>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;