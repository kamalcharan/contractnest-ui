// src/components/integrations/DynamicFormField.tsx
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { captureException } from '@/utils/sentry';

// Define ConfigField interface locally to avoid import issues
interface ConfigField {
  name: string;
  type: 'text' | 'password' | 'email' | 'boolean' | 'select' | 'number';
  required: boolean;
  sensitive: boolean;
  description: string | null;
  display_name: string;
  default?: any;
  options?: Array<{ label: string; value: string | number | boolean }>;
}

interface DynamicFormFieldProps {
  field: ConfigField;
  value: any;
  onChange: (value: any) => void;
  className?: string;
  disabled?: boolean;
}

const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
  field,
  value,
  onChange,
  className,
  disabled = false
}) => {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  
  // Format the field value correctly
  const getFormattedValue = () => {
    if (value === undefined && field.default !== undefined) {
      return field.default;
    }
    
    if (value === undefined || value === null) {
      return field.type === 'boolean' ? false : '';
    }
    
    return value;
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  // Handle field change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    try {
      const inputValue = e.target.value;
      let parsedValue: any = inputValue;
      
      // Convert to appropriate type based on field type
      if (field.type === 'number') {
        parsedValue = inputValue === '' ? '' : Number(inputValue);
      } else if (field.type === 'boolean') {
        parsedValue = (e.target as HTMLInputElement).checked;
      }
      
      onChange(parsedValue);
    } catch (error) {
      captureException(error, {
        tags: { component: 'DynamicFormField', action: 'handleChange' },
        extra: { field_name: field.name, field_type: field.type }
      });
    }
  };
  
  // Render different field types
  const renderField = () => {
    const formattedValue = getFormattedValue();
    
    switch (field.type) {
      case 'password':
        return (
          <div className="relative">
            <input
              id={field.name}
              type={passwordVisible ? 'text' : 'password'}
              value={formattedValue}
              onChange={handleChange}
              placeholder={`Enter ${field.display_name}`}
              className={cn(
                "w-full p-2 border border-border rounded-md bg-card",
                disabled && "opacity-60 cursor-not-allowed",
                className
              )}
              disabled={disabled}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
            >
              {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        );
        
      case 'boolean':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              id={field.name}
              type="checkbox"
              checked={formattedValue}
              onChange={handleChange}
              className="sr-only peer"
              disabled={disabled}
            />
            <div className={cn(
              "w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700",
              "peer-checked:after:translate-x-full peer-checked:after:border-white",
              "after:content-[''] after:absolute after:top-[2px] after:left-[2px]",
              "after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5",
              "after:transition-all dark:border-gray-600 peer-checked:bg-primary",
              disabled && "opacity-60 cursor-not-allowed"
            )}></div>
          </label>
        );
        
      case 'number':
        return (
          <input
            id={field.name}
            type="number"
            value={formattedValue}
            onChange={handleChange}
            placeholder={`Enter ${field.display_name}`}
            className={cn(
              "w-full p-2 border border-border rounded-md bg-card",
              disabled && "opacity-60 cursor-not-allowed",
              className
            )}
            disabled={disabled}
          />
        );
        
      case 'select':
        return (
          <select
            id={field.name}
            value={formattedValue}
            onChange={handleChange}
            className={cn(
              "w-full p-2 border border-border rounded-md bg-card",
              disabled && "opacity-60 cursor-not-allowed",
              className
            )}
            disabled={disabled}
          >
            <option value="">Select {field.display_name}</option>
            {field.options?.map(option => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'text':
      case 'email':
      default:
        return (
          <input
            id={field.name}
            type={field.type === 'email' ? 'email' : 'text'}
            value={formattedValue}
            onChange={handleChange}
            placeholder={`Enter ${field.display_name}`}
            className={cn(
              "w-full p-2 border border-border rounded-md bg-card",
              disabled && "opacity-60 cursor-not-allowed",
              className
            )}
            disabled={disabled}
          />
        );
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label htmlFor={field.name} className="block text-sm font-medium">
          {field.display_name}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {field.sensitive && (
          <span className="text-xs text-muted-foreground">Sensitive</span>
        )}
      </div>
      
      {renderField()}
      
      {field.description && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
      )}
    </div>
  );
};

export default DynamicFormField;