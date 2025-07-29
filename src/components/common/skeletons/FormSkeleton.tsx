// src/components/common/skeletons/FormSkeleton.tsx
import React from 'react';

interface FormFieldSkeletonProps {
  label?: boolean;
  description?: boolean;
  inputType?: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'toggle';
  width?: 'full' | 'half' | 'third' | 'quarter';
}

interface FormSkeletonProps {
  fields?: FormFieldSkeletonProps[];
  title?: boolean;
  subtitle?: boolean;
  sections?: number;
  showActions?: boolean;
  className?: string;
}

// Individual field skeleton component
export const FormFieldSkeleton: React.FC<FormFieldSkeletonProps> = ({
  label = true,
  description = false,
  inputType = 'text',
  width = 'full'
}) => {
  const widthClasses = {
    full: 'w-full',
    half: 'w-full md:w-1/2',
    third: 'w-full md:w-1/3',
    quarter: 'w-full md:w-1/4'
  };

  return (
    <div className={`${widthClasses[width]} px-2`}>
      {label && (
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2" />
      )}
      
      {inputType === 'text' && (
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
      )}
      
      {inputType === 'textarea' && (
        <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
      )}
      
      {inputType === 'select' && (
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse relative">
          <div className="absolute right-2 top-3 h-4 w-4 bg-gray-400 dark:bg-gray-600 rounded animate-pulse" />
        </div>
      )}
      
      {inputType === 'checkbox' && (
        <div className="flex items-center space-x-3">
          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        </div>
      )}
      
      {inputType === 'radio' && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            </div>
          ))}
        </div>
      )}
      
      {inputType === 'toggle' && (
        <div className="flex items-center space-x-3">
          <div className="h-6 w-11 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        </div>
      )}
      
      {description && (
        <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1" />
      )}
    </div>
  );
};

// Form section skeleton
export const FormSectionSkeleton: React.FC<{
  title?: boolean;
  fields: FormFieldSkeletonProps[];
}> = ({ title = true, fields }) => {
  return (
    <div className="space-y-6">
      {title && (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="h-6 w-40 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        </div>
      )}
      
      <div className="flex flex-wrap -mx-2 gap-y-6">
        {fields.map((field, index) => (
          <FormFieldSkeleton key={index} {...field} />
        ))}
      </div>
    </div>
  );
};

// Main form skeleton component
export const FormSkeleton: React.FC<FormSkeletonProps> = ({
  fields = [
    { inputType: 'text', width: 'full' },
    { inputType: 'select', width: 'half' },
    { inputType: 'select', width: 'half' },
    { inputType: 'textarea', width: 'full' },
    { inputType: 'checkbox', width: 'full' }
  ],
  title = true,
  subtitle = false,
  sections = 1,
  showActions = true,
  className = ''
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          {title && (
            <div className="h-7 w-48 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          )}
          {subtitle && (
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2" />
          )}
        </div>
      )}

      {/* Form Content */}
      <div className="p-6 space-y-8">
        {sections > 1 ? (
          // Multiple sections
          Array.from({ length: sections }).map((_, index) => (
            <FormSectionSkeleton
              key={index}
              title={index > 0}
              fields={fields}
            />
          ))
        ) : (
          // Single section
          <div className="flex flex-wrap -mx-2 gap-y-6">
            {fields.map((field, index) => (
              <FormFieldSkeleton key={index} {...field} />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-end space-x-3">
            <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            <div className="h-10 w-24 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};

// Inline form skeleton for simple forms
export const InlineFormSkeleton: React.FC<{
  fields?: number;
  showButton?: boolean;
  className?: string;
}> = ({ fields = 3, showButton = true, className = '' }) => {
  return (
    <div className={`flex items-end space-x-4 ${className}`}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="flex-1">
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2" />
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        </div>
      ))}
      {showButton && (
        <div className="h-10 w-24 bg-blue-200 dark:bg-blue-900 rounded-md animate-pulse" />
      )}
    </div>
  );
};

// Tab form skeleton
export const TabbedFormSkeleton: React.FC<{
  tabs?: number;
  activeTabFields?: FormFieldSkeletonProps[];
  showActions?: boolean;
}> = ({ 
  tabs = 3, 
  activeTabFields = [
    { inputType: 'text', width: 'full' },
    { inputType: 'select', width: 'half' },
    { inputType: 'select', width: 'half' },
  ],
  showActions = true 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* Tab Headers */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8 px-6">
          {Array.from({ length: tabs }).map((_, index) => (
            <div 
              key={index} 
              className={`py-4 ${index === 0 ? 'border-b-2 border-gray-300' : ''}`}
            >
              <div className="h-5 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <div className="flex flex-wrap -mx-2 gap-y-6">
          {activeTabFields.map((field, index) => (
            <FormFieldSkeleton key={index} {...field} />
          ))}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between">
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            <div className="flex items-center space-x-3">
              <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
              <div className="h-10 w-28 bg-blue-200 dark:bg-blue-900 rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormSkeleton;