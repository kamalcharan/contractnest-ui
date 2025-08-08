// src/components/businessmodel/planform/NotificationsStep.tsx
// FIXED: Added proper typing for currency and currency array operations

import React, { useState, useEffect, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Plus, Trash2, Info, ChevronDown, Bell, Edit } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  notificationItems, 
  NotificationMethodType,
  NotificationCategoryType
} from '@/utils/constants/pricing';
import { DEFAULT_VALUES } from '@/utils/constants/businessModelConstants';
import { getCurrencySymbol } from '@/utils/constants/currencies';
import { toast } from 'react-hot-toast';

// Define the structure for a notification row
interface NotificationRow {
  notif_type: string;
  category: string;
  enabled: boolean;
  credits_per_unit: number;
  prices: Record<string, number>;
}

interface NotificationsStepProps {
  isEditMode?: boolean;
}

const NotificationsStep: React.FC<NotificationsStepProps> = ({ isEditMode = false }) => {
  const { 
    watch, 
    setValue,
    getValues,
    formState: { errors }
  } = useFormContext();
  
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  // Watch plan type and currencies - FIXED: Added proper typing
  const watchPlanType = watch('planType') as string;
  const watchSupportedCurrencies = (watch('supportedCurrencies') || []) as string[];
  const watchDefaultCurrency = watch('defaultCurrencyCode') as string;
  
  // State for notifications
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  
  // State for dropdowns
  const [methodDropdownOpen, setMethodDropdownOpen] = useState<number | null>(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState<number | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  
  // Initialize selected currency
  useEffect(() => {
    if (watchSupportedCurrencies.length > 0 && !selectedCurrency) {
      setSelectedCurrency(watchDefaultCurrency || watchSupportedCurrencies[0]);
    }
  }, [watchSupportedCurrencies, watchDefaultCurrency, selectedCurrency]);
  
  // Initialize notifications from form values or defaults
  useEffect(() => {
    const formNotifications = getValues('notifications');
    
    if (Array.isArray(formNotifications) && formNotifications.length > 0) {
      setNotifications(formNotifications.map((notification: any) => ({
        ...notification,
        prices: notification.prices || {}
      })));
    } else if (!isEditMode) {
      // Add default notification if none exists and not in edit mode
      const defaultNotif: NotificationRow = {
        notif_type: DEFAULT_VALUES.DEFAULT_NOTIFICATION.METHOD,
        category: DEFAULT_VALUES.DEFAULT_NOTIFICATION.CATEGORY,
        enabled: DEFAULT_VALUES.DEFAULT_NOTIFICATION.ENABLED,
        credits_per_unit: DEFAULT_VALUES.DEFAULT_NOTIFICATION.CREDITS_PER_UNIT,
        prices: {}
      };
      
      // Initialize prices for all currencies
      if (watchSupportedCurrencies?.length) {
        watchSupportedCurrencies.forEach((currency: string) => {
          const methodDetails = notificationItems.find(
            item => item.method === defaultNotif.notif_type
          );
          defaultNotif.prices[currency] = methodDetails?.unitPrice || 0;
        });
      }
      
      setNotifications([defaultNotif]);
    }
  }, [isEditMode]); // Only run once on mount or when edit mode changes
  
  // Update form whenever notifications change - immediate sync
  useEffect(() => {
    if (notifications.length > 0) {
      setValue('notifications', notifications, { shouldDirty: true, shouldValidate: true });
      console.log('Updated form with notifications:', notifications);
    }
  }, [notifications, setValue]);
  
  // Update prices when supported currencies change - FIXED: Added proper typing
  useEffect(() => {
    if (watchSupportedCurrencies?.length && notifications.length > 0) {
      const updatedNotifications = notifications.map(notification => {
        const prices = { ...notification.prices };
        
        // Add missing currencies
        watchSupportedCurrencies.forEach((currency: string) => {
          if (prices[currency] === undefined) {
            const methodDetails = notificationItems.find(
              item => item.method === notification.notif_type
            );
            prices[currency] = methodDetails?.unitPrice || 0;
          }
        });
        
        // Remove unsupported currencies
        Object.keys(prices).forEach((currency: string) => {
          if (!watchSupportedCurrencies.includes(currency)) {
            delete prices[currency];
          }
        });
        
        return {
          ...notification,
          prices
        };
      });
      
      setNotifications(updatedNotifications);
    }
  }, [watchSupportedCurrencies]);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('[data-dropdown]') && 
          !(event.target as Element).closest('[data-dropdown-trigger]')) {
        setMethodDropdownOpen(null);
        setCategoryDropdownOpen(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Helper function to check for duplicate notification combinations
  const isDuplicateNotification = useCallback((notifType: string, category: string, excludeIndex?: number) => {
    return notifications.some((notif, index) => {
      if (excludeIndex !== undefined && index === excludeIndex) return false;
      return notif.notif_type === notifType && notif.category === category;
    });
  }, [notifications]);
  
  // Handle currency tab click
  const handleCurrencyTabClick = useCallback((e: React.MouseEvent, currencyCode: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedCurrency(currencyCode);
  }, []);
  
  // Toggle method dropdown
  const toggleMethodDropdown = useCallback((index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (methodDropdownOpen === index) {
      setMethodDropdownOpen(null);
    } else {
      setMethodDropdownOpen(index);
      setCategoryDropdownOpen(null);
    }
  }, [methodDropdownOpen]);
  
  // Toggle category dropdown
  const toggleCategoryDropdown = useCallback((index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (categoryDropdownOpen === index) {
      setCategoryDropdownOpen(null);
    } else {
      setCategoryDropdownOpen(index);
      setMethodDropdownOpen(null);
    }
  }, [categoryDropdownOpen]);
  
  // Select notification method with duplicate check
  const selectMethod = useCallback((index: number, method: NotificationMethodType, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const notification = notifications[index];
    
    // Check if this would create a duplicate
    if (isDuplicateNotification(method, notification.category, index)) {
      toast.error(`A ${method} notification with ${notification.category} category already exists`);
      setMethodDropdownOpen(null);
      return;
    }
    
    const methodItem = notificationItems.find(item => item.method === method);
    if (methodItem) {
      setNotifications(prev => {
        const updated = [...prev];
        const prices: Record<string, number> = {};
        
        // Set unit price for all supported currencies
        if (watchSupportedCurrencies?.length) {
          watchSupportedCurrencies.forEach((currency: string) => {
            prices[currency] = methodItem.unitPrice || 0;
          });
        }
        
        updated[index] = {
          ...updated[index],
          notif_type: method,
          credits_per_unit: methodItem.defaultBaseCredits,
          prices
        };
        
        return updated;
      });
    }
    
    setMethodDropdownOpen(null);
  }, [watchSupportedCurrencies, notifications, isDuplicateNotification]);
  
  // Select notification category with duplicate check
  const selectCategory = useCallback((index: number, category: NotificationCategoryType, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const notification = notifications[index];
    
    // Check if this would create a duplicate
    if (isDuplicateNotification(notification.notif_type, category, index)) {
      toast.error(`A ${notification.notif_type} notification with ${category} category already exists`);
      setCategoryDropdownOpen(null);
      return;
    }
    
    setNotifications(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        category
      };
      return updated;
    });
    
    setCategoryDropdownOpen(null);
  }, [notifications, isDuplicateNotification]);
  
  // Update notification field
  const updateNotification = useCallback((index: number, field: keyof NotificationRow, value: any) => {
    setNotifications(prev => {
      const updated = [...prev];
      
      if (field === 'prices' && typeof value === 'object') {
        updated[index] = { 
          ...updated[index], 
          prices: { ...updated[index].prices, ...value }
        };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      
      return updated;
    });
  }, []);
  
  // Update notification price for a specific currency
  const updateNotificationPrice = useCallback((index: number, currency: string, price: number) => {
    console.log(`Setting notification ${index} price for ${currency}: ${price}`);
    
    setNotifications(prev => {
      const updated = [...prev];
      const notification = { ...updated[index] };
      
      if (!notification.prices) {
        notification.prices = {};
      }
      
      // CRITICAL: Create completely new prices object to ensure independence
      const newPrices = { ...notification.prices };
      newPrices[currency] = price;
      notification.prices = newPrices;
      
      updated[index] = notification;
      
      console.log(`Updated notification ${index}:`, notification);
      return updated;
    });
  }, []);
  
  // Get notification price for the selected currency
  const getNotificationPrice = useCallback((notification: NotificationRow, currency: string): number => {
    return notification.prices?.[currency] ?? 0;
  }, []);
  
  // Add new notification with duplicate check
  const addNotification = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Find a method/category combination that doesn't exist yet
    let defaultMethod = notificationItems[0]?.method || 'Email';
    let defaultCategory: NotificationCategoryType = 'Transactional';
    
    // Try to find an unused combination
    for (const item of notificationItems) {
      for (const cat of ['Transactional', 'Direct'] as NotificationCategoryType[]) {
        if (!isDuplicateNotification(item.method, cat)) {
          defaultMethod = item.method;
          defaultCategory = cat;
          break;
        }
      }
      if (defaultMethod) break;
    }
    
    // If all combinations are used, show error
    if (isDuplicateNotification(defaultMethod, defaultCategory)) {
      toast.error('All notification method and category combinations have been added');
      return;
    }
    
    const methodItem = notificationItems.find(item => item.method === defaultMethod);
    
    const newNotification: NotificationRow = {
      notif_type: defaultMethod,
      category: defaultCategory,
      enabled: true,
      credits_per_unit: methodItem?.defaultBaseCredits || 25,
      prices: {}
    };
    
    // Set unit price for all supported currencies
    if (watchSupportedCurrencies?.length) {
      watchSupportedCurrencies.forEach((currency: string) => {
        newNotification.prices[currency] = methodItem?.unitPrice || 0;
      });
    }
    
    setNotifications(prev => [...prev, newNotification]);
  }, [watchSupportedCurrencies, isDuplicateNotification]);
  
  // Remove notification
  const removeNotification = useCallback((index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (notifications.length > 1) {
      setNotifications(prev => prev.filter((_, i) => i !== index));
    }
  }, [notifications.length]);
  
  // Toggle notification enable/disable
  const toggleEnabled = useCallback((index: number, enabled: boolean) => {
    updateNotification(index, 'enabled', enabled);
  }, [updateNotification]);
  
  // Get method details
  const getMethodDetails = useCallback((method: string) => {
    return notificationItems.find(item => item.method === method);
  }, []);
  
  return (
    <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
      {/* Edit Mode Notice */}
      {isEditMode && (
        <div 
          className="p-4 rounded-lg border transition-colors"
          style={{
            backgroundColor: `${colors.semantic.warning || '#F59E0B'}10`,
            borderColor: `${colors.semantic.warning || '#F59E0B'}20`
          }}
        >
          <div className="flex items-start">
            <Bell 
              className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5"
              style={{ color: colors.semantic.warning || '#F59E0B' }}
            />
            <div>
              <p 
                className="text-sm font-medium transition-colors"
                style={{ color: colors.semantic.warning || '#F59E0B' }}
              >
                Editing Notification Configuration
              </p>
              <p 
                className="mt-1 text-sm transition-colors"
                style={{ color: colors.semantic.warning || '#F59E0B' }}
              >
                Changes to notification credits and pricing will create a new plan version. 
                You can modify credit allocations and unit prices for different notification methods.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <p 
          className="text-sm transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          Configure notification credits included in this plan. Each {watchPlanType === 'Per User' ? 'user' : 'contract'} will receive these credits as part of the plan.
          {isEditMode && ' Changes will create a new version of this plan.'}
        </p>
      </div>
      
      {/* Currency Tabs */}
      {watchSupportedCurrencies?.length > 0 && (
        <div 
          className="border-b mb-4 transition-colors"
          style={{ borderColor: `${colors.utility.primaryText}20` }}
        >
          <div className="flex overflow-x-auto">
            {watchSupportedCurrencies.map((currencyCode: string) => {
              const isActive = selectedCurrency === currencyCode;
              const isDefault = watchDefaultCurrency === currencyCode;
              
              return (
                <button
                  key={currencyCode}
                  type="button"
                  className="px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors"
                  style={{
                    borderBottomColor: isActive ? colors.brand.primary : 'transparent',
                    color: isActive ? colors.brand.primary : colors.utility.secondaryText
                  }}
                  onClick={(e) => handleCurrencyTabClick(e, currencyCode)}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = colors.utility.primaryText;
                      e.currentTarget.style.borderBottomColor = `${colors.utility.primaryText}20`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = colors.utility.secondaryText;
                      e.currentTarget.style.borderBottomColor = 'transparent';
                    }
                  }}
                >
                  {getCurrencySymbol(currencyCode)} {currencyCode}
                  {isDefault && <span className="ml-1 text-xs">(Default)</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Notifications Table Header */}
      <div 
        className="grid grid-cols-5 gap-4 px-4 py-2 rounded-t-md border transition-colors"
        style={{
          backgroundColor: `${colors.utility.secondaryText}10`,
          borderColor: `${colors.utility.primaryText}20`
        }}
      >
        <div 
          className="col-span-1 font-medium text-sm transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Method
        </div>
        <div 
          className="col-span-1 font-medium text-sm transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Category
        </div>
        <div 
          className="col-span-1 font-medium text-sm transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Enabled
        </div>
        <div 
          className="col-span-1 font-medium text-sm transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Credits ({watchPlanType === 'Per User' ? 'per user' : 'per contract'})
        </div>
        <div 
          className="col-span-1 font-medium text-sm transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Unit Price
        </div>
      </div>
      
      {/* Notification Rows */}
      <div className="space-y-2">
        {notifications.map((notification, index) => {
          const methodDetails = getMethodDetails(notification.notif_type);
          
          return (
            <div 
              key={index} 
              className="grid grid-cols-5 gap-4 px-4 py-2 rounded-md border transition-colors"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: `${colors.utility.primaryText}20`
              }}
            >
              {/* Method Selection */}
              <div className="col-span-1 relative">
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left border rounded-md flex items-center justify-between transition-colors"
                  style={{
                    borderColor: `${colors.utility.secondaryText}40`,
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText
                  }}
                  onClick={(e) => toggleMethodDropdown(index, e)}
                  data-dropdown-trigger="method"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.utility.secondaryText}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.utility.primaryBackground;
                  }}
                >
                  <span>{notification.notif_type}</span>
                  <ChevronDown 
                    className="h-4 w-4"
                    style={{ color: colors.utility.secondaryText }}
                  />
                </button>
                
                {methodDropdownOpen === index && (
                  <div 
                    className="absolute left-0 right-0 mt-1 rounded-md shadow-lg border z-50"
                    style={{
                      backgroundColor: colors.utility.secondaryBackground,
                      borderColor: `${colors.utility.primaryText}20`,
                      maxHeight: '192px',
                      overflowY: 'auto'
                    }}
                    data-dropdown="method"
                  >
                    <div className="py-1">
                      {notificationItems.map(item => (
                        <button
                          key={item.method}
                          type="button"
                          onClick={(e) => selectMethod(index, item.method, e)}
                          className="flex items-center px-4 py-2 text-sm w-full text-left transition-colors"
                          style={{ color: colors.utility.primaryText }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${colors.utility.secondaryText}10`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <span>{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Category Selection */}
              <div className="col-span-1 relative">
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left border rounded-md flex items-center justify-between transition-colors"
                  style={{
                    borderColor: `${colors.utility.secondaryText}40`,
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText
                  }}
                  onClick={(e) => toggleCategoryDropdown(index, e)}
                  data-dropdown-trigger="category"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.utility.secondaryText}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.utility.primaryBackground;
                  }}
                >
                  <span>{notification.category}</span>
                  <ChevronDown 
                    className="h-4 w-4"
                    style={{ color: colors.utility.secondaryText }}
                  />
                </button>
                
                {categoryDropdownOpen === index && (
                  <div 
                    className="absolute left-0 right-0 mt-1 rounded-md shadow-lg border z-50"
                    style={{
                      backgroundColor: colors.utility.secondaryBackground,
                      borderColor: `${colors.utility.primaryText}20`
                    }}
                    data-dropdown="category"
                  >
                    <div className="py-1">
                      {['Transactional', 'Direct'].map(category => (
                        <button
                          key={category}
                          type="button"
                          onClick={(e) => selectCategory(index, category as NotificationCategoryType, e)}
                          className="block px-4 py-2 text-sm w-full text-left transition-colors"
                          style={{ color: colors.utility.primaryText }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${colors.utility.secondaryText}10`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Enabled Toggle */}
              <div className="col-span-1 flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={notification.enabled}
                    onChange={(e) => toggleEnabled(index, e.target.checked)}
                  />
                  <div 
                    className="w-11 h-6 rounded-full transition-colors"
                    style={{
                      backgroundColor: notification.enabled ? colors.brand.primary : `${colors.utility.secondaryText}40`
                    }}
                  >
                    <div 
                      className="absolute h-5 w-5 rounded-full bg-white transition-transform top-0.5 shadow-sm"
                      style={{
                        transform: notification.enabled ? 'translateX(1.25rem)' : 'translateX(0.125rem)'
                      }}
                    ></div>
                  </div>
                </label>
              </div>
              
              {/* Credits Per Unit */}
              <div className="col-span-1">
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 transition-colors"
                  style={{
                    borderColor: `${colors.utility.secondaryText}40`,
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText,
                    '--tw-ring-color': colors.brand.primary
                  } as React.CSSProperties}
                  value={notification.credits_per_unit}
                  onChange={(e) => updateNotification(index, 'credits_per_unit', parseInt(e.target.value) || 0)}
                  disabled={!notification.enabled}
                  min={0}
                />
              </div>
              
              {/* Unit Price and Delete */}
              <div className="col-span-1 flex items-center justify-between">
                <div className="flex items-center">
                  <span 
                    className="mr-1"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    {getCurrencySymbol(selectedCurrency)}
                  </span>
                  <input
                    type="number"
                    className="w-20 px-2 py-1 rounded-md border focus:outline-none focus:ring-2 transition-colors"
                    style={{
                      borderColor: `${colors.utility.secondaryText}40`,
                      backgroundColor: colors.utility.primaryBackground,
                      color: colors.utility.primaryText,
                      '--tw-ring-color': colors.brand.primary
                    } as React.CSSProperties}
                    value={getNotificationPrice(notification, selectedCurrency)}
                    onChange={(e) => updateNotificationPrice(index, selectedCurrency, parseFloat(e.target.value) || 0)}
                    min={0}
                    step={0.01}
                  />
                </div>
                
                <button
                  type="button"
                  onClick={(e) => removeNotification(index, e)}
                  className="p-1 ml-2 transition-colors rounded-full"
                  style={{ color: colors.utility.secondaryText }}
                  title="Remove notification"
                  disabled={notifications.length === 1}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.color = colors.semantic.error;
                      e.currentTarget.style.backgroundColor = `${colors.semantic.error}10`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.color = colors.utility.secondaryText;
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Add Notification Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={addNotification}
          className="px-4 py-2 rounded-md transition-colors inline-flex items-center text-sm border"
          style={{
            backgroundColor: `${colors.brand.primary}10`,
            color: colors.brand.primary,
            borderColor: `${colors.brand.primary}30`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${colors.brand.primary}20`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = `${colors.brand.primary}10`;
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Notification
        </button>
      </div>
      
      {/* Info Box */}
      <div 
        className="p-4 rounded-md border transition-colors"
        style={{
          backgroundColor: `${colors.brand.primary}10`,
          borderColor: `${colors.brand.primary}20`
        }}
      >
        <div className="flex items-start">
          <Info 
            className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0"
            style={{ color: colors.brand.primary }}
          />
          <div>
            <p 
              className="text-sm font-medium transition-colors"
              style={{ color: colors.brand.primary }}
            >
              {isEditMode ? 'Editing Notification Credits' : 'Notification Credits'}
            </p>
            <p 
              className="mt-1 text-sm transition-colors"
              style={{ color: colors.brand.primary }}
            >
              Credits are allocated per {watchPlanType === 'Per User' ? 'user' : 'contract'} in the plan. 
              Each notification method can only have one entry per category (Transactional or Direct).
              {isEditMode && ' Changes will create a new plan version.'}
            </p>
            <p 
              className="mt-1 text-sm transition-colors"
              style={{ color: colors.brand.primary }}
            >
              Users can purchase additional credits once their included credits are exhausted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsStep;