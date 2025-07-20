//src/components/businessmodel/dashboard/SummaryCards.tsx


import React from 'react';
import { Package, Users, AlertCircle, Calendar } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  onClick?: () => void;
  accentColor?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  value, 
  icon, 
  onClick,
  accentColor = 'text-primary'
}) => {
  return (
    <div 
      className={`bg-card border border-border rounded-lg shadow-sm p-6 hover:border-primary/30 transition-all ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className={`${accentColor} mr-4`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
};

interface SummaryCardsProps {
  activePlans: number;
  totalUsers: number;
  renewalsSoon: number;
  trialsEnding: number;
  onCardClick?: (cardType: 'plans' | 'users' | 'renewals' | 'trials') => void;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  activePlans,
  totalUsers,
  renewalsSoon,
  trialsEnding,
  onCardClick
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <SummaryCard
        title="Active Plans"
        value={activePlans}
        icon={<Package className="h-6 w-6" />}
        onClick={() => onCardClick?.('plans')}
        accentColor="text-blue-600 dark:text-blue-400"
      />
      <SummaryCard
        title="Total Users"
        value={totalUsers}
        icon={<Users className="h-6 w-6" />}
        onClick={() => onCardClick?.('users')}
        accentColor="text-purple-600 dark:text-purple-400"
      />
      <SummaryCard
        title="Renewals in Next 15 Days"
        value={renewalsSoon}
        icon={<Calendar className="h-6 w-6" />}
        onClick={() => onCardClick?.('renewals')}
        accentColor="text-green-600 dark:text-green-400"
      />
      <SummaryCard
        title="Trials Ending in 3 Days"
        value={trialsEnding}
        icon={<AlertCircle className="h-6 w-6" />}
        onClick={() => onCardClick?.('trials')}
        accentColor="text-amber-600 dark:text-amber-400"
      />
    </div>
  );
};

export default SummaryCards;