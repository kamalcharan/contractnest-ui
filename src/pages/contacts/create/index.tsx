// src/pages/contacts/create/index.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

import ContactForm from '@/components/contacts/forms/ContactForm';
import { ContactFormData, ContactTypeConfig, ValidationResult } from '@/models/contacts/types';
import { validateContactForm } from '@/utils/contacts/validation';
import { fakeContactTypes, fakeContactSources, fakeContactTags } from '@/utils/fakejson/contacts';

const CreateContactPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'simple' | 'advanced'>('simple');
  const [selectedType, setSelectedType] = useState<ContactTypeConfig | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    formType: 'INDIVIDUAL',
    channels: [
      { type: 'email', value: '', isPrimary: true },
      { type: 'mobile', value: '', isPrimary: false, countryCode: 'IN' }
    ],
    addresses: [],
    contactTypes: [],
    tags: [],
    source: 'manual'
  });
  const [validationErrors, setValidationErrors] = useState<ValidationResult>({ isValid: true, errors: [] });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Get selected contact type from session
        const selectedTypeId = sessionStorage.getItem('selected_contact_type');
        if (!selectedTypeId) {
          toast({
            variant: 'destructive',
            title: 'No contact type selected',
            description: 'Please select a contact type first.'
          });
          navigate('/contacts');
          return;
        }

        // Find the selected type
        const type = fakeContactTypes.find(t => t.id === selectedTypeId);
        if (!type) {
          toast({
            variant: 'destructive',
            title: 'Invalid contact type',
            description: 'The selected contact type was not found.'
          });
          navigate('/contacts');
          return;
        }

        setSelectedType(type);
        setFormData(prev => ({
          ...prev,
          formType: type.formType,
          contactTypes: [type.id]
        }));

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load contact form.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate, toast]);

  // Handlers
  const handleFormChange = (data: Partial<ContactFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
    // Clear validation errors when form changes
    if (validationErrors.errors.length > 0) {
      setValidationErrors({ isValid: true, errors: [] });
    }
  };

  const handleSave = async () => {
    // Validate form
    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation);
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please fix the errors before saving.'
      });
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear session storage
      sessionStorage.removeItem('selected_contact_type');
      
      toast({
        title: 'Success',
        description: 'Contact created successfully.'
      });
      
      // Navigate to contacts list
      navigate('/contacts');
    } catch (error) {
      console.error('Error saving contact:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save contact. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    sessionStorage.removeItem('selected_contact_type');
    navigate('/contacts');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">
                Create {selectedType?.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Fill in the details to create a new {selectedType?.name.toLowerCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'simple' | 'advanced')}>
              <TabsList>
                <TabsTrigger value="simple">Simple</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Actions */}
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Contact
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">
          <ContactForm
            formData={formData}
            onChange={handleFormChange}
            viewMode={viewMode}
            contactType={selectedType!}
            sources={fakeContactSources}
            tags={fakeContactTags}
            validationErrors={validationErrors}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateContactPage;