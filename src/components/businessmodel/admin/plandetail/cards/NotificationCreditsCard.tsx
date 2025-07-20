// src/components/businessmodel/admin/plandetail/cards/NotificationCreditsCard.tsx

import React from 'react';
import { Bell, Check, X, Edit } from 'lucide-react';
import { getCurrencySymbol } from '@/utils/constants/currencies';

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
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
        <Check className="h-3 w-3 mr-1" />
        Enabled
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
        <X className="h-3 w-3 mr-1" />
        Disabled
      </span>
    )
  );

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="px-6 py-4 bg-muted/20 border-b border-border flex items-center justify-between">
        <div className="flex items-center">
          <Bell className="h-5 w-5 mr-2 text-muted-foreground" />
          <h2 className="text-lg font-semibold">
            Notification Credits ({getCurrencySymbol(selectedCurrency)} {selectedCurrency})
          </h2>
        </div>
        {!isArchived && onEdit && (
          <button
            onClick={onEdit}
            className="text-sm text-primary hover:text-primary/80 flex items-center"
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
                <tr className="border-b border-border">
                  <th className="px-4 py-2 text-left font-medium">Method</th>
                  <th className="px-4 py-2 text-left font-medium">Category</th>
                  <th className="px-4 py-2 text-left font-medium">Enabled</th>
                  <th className="px-4 py-2 text-left font-medium">
                    Credits per {planType === 'Per User' ? 'User' : 'Contract'}
                  </th>
                  <th className="px-4 py-2 text-left font-medium">Unit Price</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notification, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-medium">
                          {getNotificationMethod(notification)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span>{notification.category || 'Unknown'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge enabled={notification.enabled ?? false} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">
                        {notification.credits_per_unit ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <span className="font-medium">
                          {formatPrice(getNotificationUnitPrice(notification, selectedCurrency), selectedCurrency)}
                        </span>
                        <span className="ml-1 text-muted-foreground">per credit</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto opacity-50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Notification Configuration</h3>
            <p>No notification credits have been configured for this plan.</p>
            {!isArchived && onEdit && (
              <button
                onClick={onEdit}
                className="mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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