import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

interface CategoryChartProps {
  chartData: any;
  chartOptions: ChartOptions<'doughnut'>;
  hasTransactions: boolean;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ chartData, chartOptions, hasTransactions }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
      <div className="h-96">
        {hasTransactions ? (
          <Doughnut options={chartOptions} data={chartData} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-gray-500 dark:text-gray-400">Nenhuma despesa registada para exibir o gráfico.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Adicione a sua primeira transação para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryChart;