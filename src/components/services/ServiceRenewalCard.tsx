// src/components/services/ServiceRenewalCard.tsx - Theme Enabled Version
import React from 'react';
import { RefreshCw, AlertTriangle, Calendar, CheckCircle, Clock } from 'lucide-react';

interface ServiceRenewalCardProps {
  contactId: string;
}

const ServiceRenewalCard: React.FC<ServiceRenewalCardProps> = ({ contactId }) => {
  // Mock renewal data - this would come from API
  const renewalData = {
    dueThisWeek: [
      {
        id: '1',
        title: 'Website Maintenance',
        value: 15000,
        currency: 'INR',
        renewalDate: '2024-01-22',
        priority: 'high',
        autoRenewal: false
      }
    ],
    dueNextMonth: [
      {
        id: '2',
        title: 'Mobile App Support',
        value: 25000,
        currency: 'INR',
        renewalDate: '2024-02-15',
        priority: 'medium',
        autoRenewal: true
      },
      {
        id: '3',
        title: 'Cloud Hosting',
        value: 8000,
        currency: 'INR',
        renewalDate: '2024-02-28',
        priority: 'low',
        autoRenewal: true
      }
    ],
    autoRenewing: [
      {
        id: '4',
        title: 'Backup Services',
        value: 5000,
        currency: 'INR',
        renewalDate: '2024-03-01',
        lastRenewal: '2024-01-01'
      }
    ]
  };

  const formatAmount = (amount: number, currency: string) => {
    const symbols = { INR: '₹', USD: '$', EUR: '€' };
    const symbol = symbols[currency as keyof typeof symbols] || currency;
    
    if (currency === 'INR') {
      if (amount >= 100000) {
        return `${symbol}${(amount / 100000).toFixed(1)}L`;
      } else if (amount >= 1000) {
        return `${symbol}${(amount / 1000).toFixed(1)}K`;
      }
    }
    return `${symbol}${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilRenewal = (renewalDate: string) => {
    const today = new Date();
    const renewal = new Date(renewalDate);
    const diffTime = renewal.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high': 
        return {
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800'
        };
      case 'medium': 
        return {
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-100 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800'
        };
      case 'low': 
        return {
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800'
        };
      default: 
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-border'
        };
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <RefreshCw className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-base font-semibold text-foreground">Service Renewals</h3>
      </div>
      
      <div className="space-y-6">
        {/* Due This Week */}
        {renewalData.dueThisWeek.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <h4 className="font-medium text-sm text-red-600 dark:text-red-400">Due This Week</h4>
            </div>
            <div className="space-y-2">
              {renewalData.dueThisWeek.map((service) => {
                const priorityConfig = getPriorityConfig(service.priority);
                return (
                  <div key={service.id} className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm text-foreground truncate">
                        {service.title}
                      </h5>
                      <div className="flex items-center gap-2">
                        {!service.autoRenewal && (
                          <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 text-xs rounded-full font-medium border border-orange-200 dark:border-orange-800">
                            MANUAL
                          </span>
                        )}
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium border
                          ${priorityConfig.color} ${priorityConfig.bgColor} ${priorityConfig.borderColor}
                        `}>
                          {service.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {formatAmount(service.value, service.currency)}
                      </span>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {formatDate(service.renewalDate)}
                        </div>
                        <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                          {getDaysUntilRenewal(service.renewalDate)} days left
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Due Next Month */}
        {renewalData.dueNextMonth.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <h4 className="font-medium text-sm text-orange-600 dark:text-orange-400">Due Next Month</h4>
            </div>
            <div className="space-y-2">
              {renewalData.dueNextMonth.map((service) => {
                const priorityConfig = getPriorityConfig(service.priority);
                return (
                  <div key={service.id} className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm text-foreground truncate">
                        {service.title}
                      </h5>
                      <div className="flex items-center gap-2">
                        {service.autoRenewal && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs rounded-full font-medium border border-green-200 dark:border-green-800">
                            AUTO
                          </span>
                        )}
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium border
                          ${priorityConfig.color} ${priorityConfig.bgColor} ${priorityConfig.borderColor}
                        `}>
                          {service.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {formatAmount(service.value, service.currency)}
                      </span>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {formatDate(service.renewalDate)}
                        </div>
                        <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                          {getDaysUntilRenewal(service.renewalDate)} days left
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Auto-Renewing Services */}
        {renewalData.autoRenewing.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <h4 className="font-medium text-sm text-green-600 dark:text-green-400">Auto-Renewing</h4>
            </div>
            <div className="space-y-2">
              {renewalData.autoRenewing.map((service) => (
                <div key={service.id} className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-sm text-foreground truncate">
                      {service.title}
                    </h5>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs rounded-full font-medium border border-green-200 dark:border-green-800">
                      AUTO-RENEW
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {formatAmount(service.value, service.currency)}
                    </span>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        Next: {formatDate(service.renewalDate)}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400">
                        Last renewed: {formatDate(service.lastRenewal)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Renewals */}
        {renewalData.dueThisWeek.length === 0 && 
         renewalData.dueNextMonth.length === 0 && 
         renewalData.autoRenewing.length === 0 && (
          <div className="text-center py-6">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No services due for renewal
            </p>
          </div>
        )}
      </div>

      {/* Renewal Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-red-600 dark:text-red-400">
              {renewalData.dueThisWeek.length}
            </div>
            <div className="text-xs text-muted-foreground">Urgent</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              {renewalData.autoRenewing.length}
            </div>
            <div className="text-xs text-muted-foreground">Auto-Renew</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRenewalCard;