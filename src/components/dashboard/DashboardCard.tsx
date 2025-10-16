import React from 'react';

const DashboardCard = ({
  title,
  icon,
  children,
  className = '',
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 ${className}`}
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="text-purple-500 dark:text-purple-400">{icon}</div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

export default DashboardCard;