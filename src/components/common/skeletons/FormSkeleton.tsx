// src/components/common/skeletons/FormSkeleton.tsx
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const widthClasses = {
    full: 'w-full',
    half: 'w-full md:w-1/2',
    third: 'w-full md:w-1/3',
    quarter: 'w-full md:w-1/4'
  };

  return (
    <div className={`${widthClasses[width]} px-2`}>
      {label && (
        <div 
          className="h-4 w-24 rounded animate-pulse mb-2 transition-colors"
          style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
        />
      )}
      
      {inputType === 'text' && (
        <div 
          className="h-10 w-full rounded-md animate-pulse transition-colors"
          style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
        />
      )}
      
      {inputType === 'textarea' && (
        <div 
          className="h-24 w-full rounded-md animate-pulse transition-colors"
          style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
        />
      )}
      
      {inputType === 'select' && (
        <div 
          className="h-10 w-full rounded-md animate-pulse relative transition-colors"
          style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
        >
          <div 
            className="absolute right-2 top-3 h-4 w-4 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
          />
        </div>
      )}
      
      {inputType === 'checkbox' && (
        <div className="flex items-center space-x-3">
          <div 
            className="h-5 w-5 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
          />
          <div 
            className="h-4 w-32 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
          />
        </div>
      )}
      
      {inputType === 'radio' && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div 
                className="h-5 w-5 rounded-full animate-pulse transition-colors"
                style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
              />
              <div 
                className="h-4 w-24 rounded animate-pulse transition-colors"
                style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
              />
            </div>
          ))}
        </div>
      )}
      
      {inputType === 'toggle' && (
        <div className="flex items-center space-x-3">
          <div 
            className="h-6 w-11 rounded-full animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
          />
          <div 
            className="h-4 w-32 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
          />
        </div>
      )}
      
      {description && (
        <div 
          className="h-3 w-48 rounded animate-pulse mt-1 transition-colors"
          style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
        />
      )}
    </div>
  );
};

// Form section skeleton
export const FormSectionSkeleton: React.FC<{
  title?: boolean;
  fields: FormFieldSkeletonProps[];
}> = ({ title = true, fields }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div className="space-y-6">
      {title && (
        <div 
          className="border-b pb-4 transition-colors"
          style={{ borderColor: `${colors.utility.secondaryText}40` }}
        >
          <div 
            className="h-6 w-40 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
          />
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
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div 
      className={`rounded-lg shadow-sm transition-colors ${className}`}
      style={{ backgroundColor: colors.utility.secondaryBackground }}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div 
          className="px-6 py-4 border-b transition-colors"
          style={{ borderColor: `${colors.utility.secondaryText}40` }}
        >
          {title && (
            <div 
              className="h-7 w-48 rounded animate-pulse transition-colors"
              style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
            />
          )}
          {subtitle && (
            <div 
              className="h-4 w-64 rounded animate-pulse mt-2 transition-colors"
              style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
            />
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
        <div 
          className="px-6 py-4 border-t transition-colors"
          style={{
            borderColor: `${colors.utility.secondaryText}40`,
            backgroundColor: `${colors.utility.primaryBackground}50`
          }}
        >
          <div className="flex items-center justify-end space-x-3">
            <div 
              className="h-10 w-20 rounded-md animate-pulse transition-colors"
              style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
            />
            <div 
              className="h-10 w-24 rounded-md animate-pulse transition-colors"
              style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
            />
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
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div className={`flex items-end space-x-4 ${className}`}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="flex-1">
          <div 
            className="h-4 w-16 rounded animate-pulse mb-2 transition-colors"
            style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
          />
          <div 
            className="h-10 w-full rounded-md animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
          />
        </div>
      ))}
      {showButton && (
        <div 
          className="h-10 w-24 rounded-md animate-pulse transition-colors"
          style={{ backgroundColor: `${colors.brand.primary}40` }}
        />
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
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div 
      className="rounded-lg shadow-sm transition-colors"
      style={{ backgroundColor: colors.utility.secondaryBackground }}
    >
      {/* Tab Headers */}
      <div 
        className="border-b transition-colors"
        style={{ borderColor: `${colors.utility.secondaryText}40` }}
      >
        <div className="flex space-x-8 px-6">
          {Array.from({ length: tabs }).map((_, index) => (
            <div 
              key={index} 
              className={`py-4 ${index === 0 ? 'border-b-2' : ''} transition-colors`}
              style={{ borderColor: index === 0 ? `${colors.utility.secondaryText}60` : 'transparent' }}
            >
              <div 
                className="h-5 w-20 rounded animate-pulse transition-colors"
                style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
              />
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
        <div 
          className="px-6 py-4 border-t transition-colors"
          style={{
            borderColor: `${colors.utility.secondaryText}40`,
            backgroundColor: `${colors.utility.primaryBackground}50`
          }}
        >
          <div className="flex items-center justify-between">
            <div 
              className="h-10 w-24 rounded-md animate-pulse transition-colors"
              style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
            />
            <div className="flex items-center space-x-3">
              <div 
                className="h-10 w-20 rounded-md animate-pulse transition-colors"
                style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
              />
              <div 
                className="h-10 w-28 rounded-md animate-pulse transition-colors"
                style={{ backgroundColor: `${colors.brand.primary}40` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormSkeleton;