//src/components/businessmodel/dashboard/SummaryCards.tsx

import React from 'react';
import { Package, Users, AlertCircle, Calendar } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

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
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div 
      className={`rounded-lg shadow-sm p-6 hover:opacity-90 transition-all ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        border: `1px solid ${colors.utility.primaryText}20`,
        '--hover-border': `${colors.brand.primary}30`
      } as React.CSSProperties}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = `${colors.brand.primary}30`;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = `${colors.utility.primaryText}20`;
        }
      }}
    >
      <div className="flex items-start">
        <div className="mr-4" style={{ color: accentColor }}>
          {icon}
        </div>
        <div>
          <h3 
            className="text-sm font-medium transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            {title}
          </h3>
          <p 
            className="text-2xl font-bold mt-1 transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            {value}
          </p>
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
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <SummaryCard
        title="Active Plans"
        value={activePlans}
        icon={<Package className="h-6 w-6" />}
        onClick={() => onCardClick?.('plans')}
        accentColor={isDarkMode ? '#60A5FA' : '#2563EB'}
      />
      <SummaryCard
        title="Total Users"
        value={totalUsers}
        icon={<Users className="h-6 w-6" />}
        onClick={() => onCardClick?.('users')}
        accentColor={isDarkMode ? '#A78BFA' : '#7C3AED'}
      />
      <SummaryCard
        title="Renewals in Next 15 Days"
        value={renewalsSoon}
        icon={<Calendar className="h-6 w-6" />}
        onClick={() => onCardClick?.('renewals')}
        accentColor={colors.semantic.success}
      />
      <SummaryCard
        title="Trials Ending in 3 Days"
        value={trialsEnding}
        icon={<AlertCircle className="h-6 w-6" />}
        onClick={() => onCardClick?.('trials')}
        accentColor={isDarkMode ? '#FBBF24' : '#D97706'}
      />
    </div>
  );
};

export default SummaryCards;