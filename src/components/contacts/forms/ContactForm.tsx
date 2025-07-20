// src/components/contacts/forms/ContactForm.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SimpleForm from './SimpleForm';
import AdvancedForm from './AdvancedForm';
import { ContactFormData, ContactTypeConfig, ValidationResult } from '@/models/contacts/types';

interface ContactFormProps {
  formData: ContactFormData;
  onChange: (data: Partial<ContactFormData>) => void;
  viewMode: 'simple' | 'advanced';
  contactType: ContactTypeConfig;
  sources: Array<{ id: string; name: string }>;
  tags: Array<{ id: string; name: string; color: string }>;
  validationErrors?: ValidationResult;
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  formData,
  onChange,
  viewMode,
  contactType,
  sources,
  tags,
  validationErrors,
  className
}) => {
  // Determine form type based on contact type
  const isIndividual = formData.formType === 'INDIVIDUAL';

  return (
    <div className={className}>
      {viewMode === 'simple' ? (
        <SimpleForm
          formData={formData}
          onChange={onChange}
          isIndividual={isIndividual}
          contactType={contactType}
          validationErrors={validationErrors}
        />
      ) : (
        <AdvancedForm
          formData={formData}
          onChange={onChange}
          isIndividual={isIndividual}
          contactType={contactType}
          sources={sources}
          tags={tags}
          validationErrors={validationErrors}
        />
      )}
    </div>
  );
};

export default ContactForm;