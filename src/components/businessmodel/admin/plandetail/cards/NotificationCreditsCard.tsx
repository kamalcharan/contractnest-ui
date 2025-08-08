// src/components/businessmodel/admin/plandetail/cards/NotificationCreditsCard.tsx

import React from 'react';
import { Bell, Check, X, Edit } from 'lucide-react';
import { getCurrencySymbol } from '@/utils/constants/currencies';
import { useTheme } from '../../../../../contexts/ThemeContext';

interface NotificationConfig {
  notif_type?: string;
  method?: string; // Alias for notif_type
  category?: string;
  enabled?: boolean;
  credits_per_unit?: number;
  prices?: Record<string, number>;
}

interface NotificationCreditsCardProps {
  notifications: NotificationConfig[];
  selectedCurrency: string;
  planType: string;
  isArchived?: boolean;
  onEdit?: () => void;
}

const NotificationCreditsCard: React.FC<NotificationCreditsCardProps> = ({
  notifications = [],
  selectedCurrency,
  planType,
  isArchived = false,
  onEdit
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Format price with currency symbol
  const formatPrice = (price: number | null | undefined, currencyCode: string) => {
    if (price === null || price === undefined) return 'N/A';
    return `${getCurrencySymbol(currencyCode)} ${price.toFixed(2)}`;
  };

  // Get notification unit price based on selected currency
  const getNotificationUnitPrice = (notification: NotificationConfig, currency: string) => {
    if (notification.prices && notification.prices[currency] !== undefined) {
      return notification.prices[currency];
    }
    return null;
  };

  // Get notification method name
  const getNotificationMethod = (notification: NotificationConfig) => {
    return notification.notif_type || notification.method || 'Unknown';
  };

  // Status badge component
  const StatusBadge: React.FC<{ enabled: boolean }> = ({ enabled }) => (
    enabled ? (
      <span 
        className="inline-flex items-center px-2 py-1 rounded-full text-xs transition-colors"
        style={{
          backgroundColor: colors.semantic.success + '20',
          color: colors.semantic.success
        }}
      >
        <Check className="h-3 w-3 mr-1" />
        Enabled
      </span>
    ) : (
      <span 
        className="inline-flex items-center px-2 py-1 rounded-full text-xs transition-colors"
        style={{
          backgroundColor: colors.utility.primaryBackground + '80',
          color: colors.utility.secondaryText
        }}
      >
        <X className="h-3 w-3 mr-1" />
        Disabled
      </span>
    )
  );

  return (
    <div 
      className="rounded-lg border overflow-hidden transition-colors"
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: colors.utility.primaryText + '20'
      }}
    >
      <div 
        className="px-6 py-4 border-b flex items-center justify-between transition-colors"
        style={{
          backgroundColor: colors.utility.primaryBackground + '20',
          borderColor: colors.utility.primaryText + '20'
        }}
      >
        <div className="flex items-center">
          <Bell 
            className="h-5 w-5 mr-2 transition-colors" 
            style={{ color: colors.utility.secondaryText }}
          />
          <h2 
            className="text-lg font-semibold transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Notification Credits ({getCurrencySymbol(selectedCurrency)} {selectedCurrency})
          </h2>
        </div>
        {!isArchived && onEdit && (
          <button
            onClick={onEdit}
            className="text-sm flex items-center transition-colors hover:opacity-80"
            style={{ color: colors.brand.primary }}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </button>
        )}
      </div>
      <div className="p-6">
        {notifications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr 
                  className="border-b transition-colors"
                  style={{ borderColor: colors.utility.primaryText + '20' }}
                >
                  <th 
                    className="px-4 py-2 text-left font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Method
                  </th>
                  <th 
                    className="px-4 py-2 text-left font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Category
                  </th>
                  <th 
                    className="px-4 py-2 text-left font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Enabled
                  </th>
                  <th 
                    className="px-4 py-2 text-left font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Credits per {planType === 'Per User' ? 'User' : 'Contract'}
                  </th>
                  <th 
                    className="px-4 py-2 text-left font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Unit Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notification, index) => (
                  <tr 
                    key={index} 
                    className="border-b transition-colors"
                    style={{ borderColor: colors.utility.primaryText + '20' }}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <span 
                          className="font-medium transition-colors"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {getNotificationMethod(notification)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span 
                        className="transition-colors"
                        style={{ color: colors.utility.primaryText }}
                      >
                        {notification.category || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge enabled={notification.enabled ?? false} />
                    </td>
                    <td className="px-4 py-3">
                      <span 
                        className="font-medium transition-colors"
                        style={{ color: colors.utility.primaryText }}
                      >
                        {notification.credits_per_unit ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <span 
                          className="font-medium transition-colors"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {formatPrice(getNotificationUnitPrice(notification, selectedCurrency), selectedCurrency)}
                        </span>
                        <span 
                          className="ml-1 transition-colors"
                          style={{ color: colors.utility.secondaryText }}
                        >
                          per credit
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div 
            className="text-center p-8 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            <Bell 
              className="h-12 w-12 mx-auto opacity-50 mb-4" 
              style={{ color: colors.utility.secondaryText }}
            />
            <h3 
              className="text-lg font-medium mb-2 transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              No Notification Configuration
            </h3>
            <p>No notification credits have been configured for this plan.</p>
            {!isArchived && onEdit && (
              <button
                onClick={onEdit}
                className="mt-4 px-4 py-2 rounded-md transition-colors hover:opacity-90"
                style={{
                  background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
                  color: '#FFFFFF'
                }}
              >
                Add Notifications
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCreditsCard;