// src/components/contacts/forms/AdvancedForm.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import BasicInfoSection from '../form-sections/BasicInfoSection';
import ChannelsSection from '../form-sections/ChannelsSection';
import AddressesSection from '../form-sections/AddressesSection';
import ContactTypesSection from '../form-sections/ContactTypesSection';
import SourceTagsSection from '../form-sections/SourceTagsSection';
import CustomFieldsSection from '../form-sections/CustomFieldsSection';
import ContactPersonSection from '../form-sections/ContactPersonSection';
import NotesSection from '../form-sections/NotesSection';

import { ContactFormData, ContactTypeConfig, ValidationResult } from '@/models/contacts/types';
import { fakeContactTypes } from '@/utils/fakejson/contacts';

interface AdvancedFormProps {
  formData: ContactFormData;
  onChange: (data: Partial<ContactFormData>) => void;
  isIndividual: boolean;
  contactType: ContactTypeConfig;
  sources: Array<{ id: string; name: string }>;
  tags: Array<{ id: string; name: string; color: string }>;
  validationErrors?: ValidationResult;
}

const AdvancedForm: React.FC<AdvancedFormProps> = ({
  formData,
  onChange,
  isIndividual,
  contactType,
  sources,
  tags,
  validationErrors = { isValid: true, errors: [] }
}) => {
  return (
    <div className="space-y-6">
      {/* Use Tabs for better organization in advanced mode */}
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="contact">Contact Details</TabsTrigger>
          <TabsTrigger value="additional">Additional Info</TabsTrigger>
          {!isIndividual && <TabsTrigger value="persons">Contact Persons</TabsTrigger>}
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {isIndividual ? 'Personal Information' : 'Company Information'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BasicInfoSection
                formData={formData}
                onChange={onChange}
                isIndividual={isIndividual}
                validationErrors={validationErrors}
              />
            </CardContent>
          </Card>

          {/* Contact Types */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactTypesSection
                selectedTypes={formData.contactTypes}
                availableTypes={fakeContactTypes}
                onChange={(types) => onChange({ contactTypes: types })}
                validationErrors={validationErrors}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Details Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Communication Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <ChannelsSection
                channels={formData.channels}
                onChange={(channels) => onChange({ channels })}
                validationErrors={validationErrors}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Addresses</CardTitle>
            </CardHeader>
            <CardContent>
              <AddressesSection
                addresses={formData.addresses || []}
                onChange={(addresses) => onChange({ addresses })}
                validationErrors={validationErrors}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Additional Information Tab */}
        <TabsContent value="additional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Source & Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <SourceTagsSection
                source={formData.source}
                tags={formData.tags}
                availableSources={sources}
                availableTags={tags}
                onSourceChange={(source) => onChange({ source })}
                onTagsChange={(tags) => onChange({ tags })}
              />
            </CardContent>
          </Card>

          {/* Custom Fields */}
          {contactType.customFields && contactType.customFields.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Fields</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomFieldsSection
                  fields={contactType.customFields}
                  values={formData.customFields || {}}
                  onChange={(customFields) => onChange({ customFields })}
                />
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <NotesSection
                notes={formData.notes || ''}
                onChange={(notes) => onChange({ notes })}
                showCharacterCount={true}
                showMarkdownHint={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Persons Tab (Corporate only) */}
        {!isIndividual && (
          <TabsContent value="persons">
            <Card>
              <CardHeader>
                <CardTitle>Contact Persons</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactPersonSection
                  contactPersons={formData.contactPersons || []}
                  onChange={(contactPersons) => onChange({ contactPersons })}
                  validationErrors={validationErrors}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AdvancedForm;