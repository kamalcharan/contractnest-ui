// src/components/contacts/filters/BillingFilter.tsx
import React from 'react';
import { 
  DollarSign, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  TrendingUp,
  CreditCard 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface BillingFilterProps {
  filters: Record<string, any>;
  onChange: (filters: Record<string, any>) => void;
}

const BillingFilter: React.FC<BillingFilterProps> = ({ filters, onChange }) => {
  const billingOptions = [
    { 
      id: 'all', 
      label: 'All', 
      icon: CreditCard,
      description: 'Show all billing statuses',
      color: 'text-muted-foreground'
    },
    { 
      id: 'overdue', 
      label: 'Overdue', 
      icon: AlertTriangle,
      description: 'Payments past due date',
      color: 'text-red-600'
    },
    { 
      id: 'dueNextWeek', 
      label: 'Due Next Week', 
      icon: Clock,
      description: 'Payments due in 7 days',
      color: 'text-orange-600'
    },
    { 
      id: 'dueNextMonth', 
      label: 'Due Next Month', 
      icon: Calendar,
      description: 'Payments due in 30 days',
      color: 'text-blue-600'
    },
    { 
      id: 'dueAnytime', 
      label: 'Due Anytime', 
      icon: TrendingUp,
      description: 'All pending payments',
      color: 'text-green-600'
    }
  ];

  const handleToggle = (optionId: string) => {
    if (optionId === 'all') {
      const { minAmount, maxAmount, ...rest } = filters;
      onChange({});
    } else {
      const newFilters = { ...filters };
      
      if (newFilters.all) {
        delete newFilters.all;
      }

      if (newFilters[optionId]) {
        delete newFilters[optionId];
      } else {
        newFilters[optionId] = true;
      }

      const hasStatusFilters = Object.keys(newFilters).some(key => 
        billingOptions.some(opt => opt.id === key)
      );

      if (!hasStatusFilters) {
        onChange({ all: true, ...newFilters });
      } else {
        onChange(newFilters);
      }
    }
  };

  const isSelected = (optionId: string) => {
    if (optionId === 'all' && !Object.keys(filters).some(key => 
      billingOptions.slice(1).some(opt => opt.id === key)
    )) {
      return true;
    }
    return filters[optionId] === true;
  };

  // Amount range handler
  const handleAmountChange = (type: 'min' | 'max', value: string) => {
    const newFilters = { ...filters };
    if (value) {
      newFilters[type === 'min' ? 'minAmount' : 'maxAmount'] = parseFloat(value);
    } else {
      delete newFilters[type === 'min' ? 'minAmount' : 'maxAmount'];
    }
    onChange(newFilters);
  };

  return (
    <div className="space-y-4">
      {/* Main Filter Options */}
      <div className="flex flex-wrap gap-2">
        {billingOptions.map((option) => {
          const Icon = option.icon;
          const selected = isSelected(option.id);
          
          return (
            <Button
              key={option.id}
              variant={selected ? "default" : "outline"}
              size="sm"
              onClick={() => handleToggle(option.id)}
              className={cn(
                "h-9",
                !selected && "hover:bg-muted"
              )}
            >
              <Icon className={cn("h-4 w-4 mr-2", !selected && option.color)} />
              {option.label}
            </Button>
          );
        })}
      </div>

      {/* Amount Range Filter */}
      <div className="space-y-3 pt-3 border-t">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Amount Range
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="minAmount" className="text-xs">Minimum</Label>
            <Input
              id="minAmount"
              type="number"
              placeholder="0"
              value={filters.minAmount || ''}
              onChange={(e) => handleAmountChange('min', e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxAmount" className="text-xs">Maximum</Label>
            <Input
              id="maxAmount"
              type="number"
              placeholder="Any"
              value={filters.maxAmount || ''}
              onChange={(e) => handleAmountChange('max', e.target.value)}
              className="h-9"
            />
          </div>
        </div>
      </div>

      {/* Payment Method Filter */}
      <div className="space-y-3 pt-3 border-t">
        <h4 className="text-sm font-medium">Payment Method</h4>
        <div className="flex flex-wrap gap-2">
          {['Credit Card', 'Bank Transfer', 'Cash', 'Check', 'Online'].map((method) => {
            const isMethodSelected = filters[`method_${method.toLowerCase().replace(' ', '_')}`] === true;
            return (
              <Button
                key={method}
                variant={isMethodSelected ? "secondary" : "outline"}
                size="sm"
                onClick={() => {
                  const newFilters = { ...filters };
                  const key = `method_${method.toLowerCase().replace(' ', '_')}`;
                  if (newFilters[key]) {
                    delete newFilters[key];
                  } else {
                    newFilters[key] = true;
                  }
                  onChange(newFilters);
                }}
                className="h-8"
              >
                {method}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-3 pt-3 border-t">
        <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
          <p className="text-2xl font-bold text-red-600">₹45,280</p>
          <p className="text-xs text-red-600/80">Overdue</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
          <p className="text-2xl font-bold text-orange-600">₹28,150</p>
          <p className="text-xs text-orange-600/80">Due Soon</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
          <p className="text-2xl font-bold text-green-600">₹1,82,400</p>
          <p className="text-xs text-green-600/80">Collected</p>
        </div>
      </div>

      {/* Filter Description */}
      <div className="text-sm text-muted-foreground">
        {!Object.keys(filters).some(key => 
          billingOptions.slice(1).some(opt => opt.id === key)
        ) && !filters.minAmount && !filters.maxAmount ? (
          <p>Showing all billing records without any filters.</p>
        ) : (
          <p>
            Showing billing records
            {Object.keys(filters).some(key => 
              billingOptions.slice(1).some(opt => opt.id === key)
            ) && ' that are '}
            {Object.keys(filters)
              .filter(key => billingOptions.slice(1).some(opt => opt.id === key))
              .map((key, index, array) => (
                <span key={key}>
                  <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                  {index < array.length - 2 && ', '}
                  {index === array.length - 2 && ' or '}
                </span>
              ))}
            {(filters.minAmount || filters.maxAmount) && 
              ` with amounts ${filters.minAmount ? `from ₹${filters.minAmount}` : ''} 
               ${filters.minAmount && filters.maxAmount ? 'to' : ''} 
               ${filters.maxAmount ? `₹${filters.maxAmount}` : ''}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default BillingFilter;