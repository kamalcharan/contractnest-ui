import {
  ContactFormData,
  ValidationResult,
  ValidationError,
  ContactChannelForm
} from '@/models/contacts/types';
import {
  VALIDATION_RULES,
  ERROR_MESSAGES
} from '@/utils/constants/contacts';
import { 
  CHANNELS, 
  getChannelByCode, 
  validateChannelValue 
} from '@/lib/constants/channels';

export const validateContactForm = (data: ContactFormData): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate based on form type
  if (data.formType === 'INDIVIDUAL') {
    // First name is required for individuals
    if (!data.firstName?.trim()) {
      errors.push({
        field: 'firstName',
        message: ERROR_MESSAGES.REQUIRED_FIELD
      });
    } else if (data.firstName.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
      errors.push({
        field: 'firstName',
        message: ERROR_MESSAGES.MIN_LENGTH(VALIDATION_RULES.NAME_MIN_LENGTH)
      });
    } else if (data.firstName.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
      errors.push({
        field: 'firstName',
        message: ERROR_MESSAGES.MAX_LENGTH(VALIDATION_RULES.NAME_MAX_LENGTH)
      });
    }
  } else if (data.formType === 'CORPORATE') {
    // Company name is required for corporate
    if (!data.corporateName?.trim()) {
      errors.push({
        field: 'corporateName',
        message: ERROR_MESSAGES.REQUIRED_FIELD
      });
    } else if (data.corporateName.length > VALIDATION_RULES.COMPANY_MAX_LENGTH) {
      errors.push({
        field: 'corporateName',
        message: ERROR_MESSAGES.MAX_LENGTH(VALIDATION_RULES.COMPANY_MAX_LENGTH)
      });
    }
  }

  // Validate channels
  const channelErrors = validateChannels(data.channels);
  errors.push(...channelErrors);

  // Validate contact types (at least one required)
  if (!data.contactTypes || data.contactTypes.length === 0) {
    errors.push({
      field: 'contactTypes',
      message: 'At least one contact type must be selected'
    });
  }

  // Validate addresses if provided
  data.addresses?.forEach((address, index) => {
    if (address.street && address.street.length > VALIDATION_RULES.ADDRESS_MAX_LENGTH) {
      errors.push({
        field: `addresses.${index}.street`,
        message: ERROR_MESSAGES.MAX_LENGTH(VALIDATION_RULES.ADDRESS_MAX_LENGTH)
      });
    }
    if (address.postalCode && address.postalCode.length > VALIDATION_RULES.POSTAL_CODE_MAX_LENGTH) {
      errors.push({
        field: `addresses.${index}.postalCode`,
        message: ERROR_MESSAGES.MAX_LENGTH(VALIDATION_RULES.POSTAL_CODE_MAX_LENGTH)
      });
    }
  });

  // Validate notes length if provided
  if (data.notes && data.notes.length > VALIDATION_RULES.NOTES_MAX_LENGTH) {
    errors.push({
      field: 'notes',
      message: ERROR_MESSAGES.MAX_LENGTH(VALIDATION_RULES.NOTES_MAX_LENGTH)
    });
  }

  // Validate contact persons for corporate
  if (data.formType === 'CORPORATE' && data.contactPersons) {
    data.contactPersons.forEach((person, index) => {
      if (!person.firstName?.trim()) {
        errors.push({
          field: `contactPersons.${index}.firstName`,
          message: ERROR_MESSAGES.REQUIRED_FIELD
        });
      }
      // Validate contact person channels
      const personChannelErrors = validateChannels(person.channels, `contactPersons.${index}.channels`);
      errors.push(...personChannelErrors);
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateChannels = (channels: ContactChannelForm[], fieldPrefix = 'channels'): ValidationError[] => {
  const errors: ValidationError[] = [];

  // At least one channel is required
  if (!channels || channels.length === 0) {
    errors.push({
      field: fieldPrefix,
      message: ERROR_MESSAGES.NO_CHANNELS
    });
    return errors;
  }

  // Check for at least one primary channel
  const hasPrimary = channels.some(ch => ch.isPrimary);
  if (!hasPrimary) {
    errors.push({
      field: fieldPrefix,
      message: ERROR_MESSAGES.NO_PRIMARY_CHANNEL
    });
  }

  // Check for multiple primary channels
  const primaryCount = channels.filter(ch => ch.isPrimary).length;
  if (primaryCount > 1) {
    errors.push({
      field: fieldPrefix,
      message: ERROR_MESSAGES.DUPLICATE_PRIMARY
    });
  }

  // Validate each channel
  channels.forEach((channel, index) => {
    if (!channel.value?.trim()) {
      if (channel.isPrimary) {
        errors.push({
          field: `${fieldPrefix}.${index}.value`,
          message: ERROR_MESSAGES.REQUIRED_FIELD
        });
      }
      return; // Skip further validation for empty non-primary channels
    }

    // Get channel configuration
    const channelConfig = getChannelByCode(channel.type);
    if (!channelConfig) {
      errors.push({
        field: `${fieldPrefix}.${index}.type`,
        message: 'Invalid channel type'
      });
      return;
    }

    // Use the existing validateChannelValue function
    const isValid = validateChannelValue(channelConfig, channel.value, channel.countryCode);
    if (!isValid) {
      const validation = channelConfig.validation;
      let errorMessage = 'Invalid value';

      switch (validation.type) {
        case 'email':
          errorMessage = ERROR_MESSAGES.INVALID_EMAIL;
          break;
        case 'phone':
          errorMessage = ERROR_MESSAGES.INVALID_PHONE;
          break;
        case 'url':
        case 'social':
          errorMessage = ERROR_MESSAGES.INVALID_URL;
          break;
      }

      errors.push({
        field: `${fieldPrefix}.${index}.value`,
        message: errorMessage
      });
    }

    // Check country code for phone types
    if (channelConfig.validation.requiresCountryCode && !channel.countryCode) {
      errors.push({
        field: `${fieldPrefix}.${index}.countryCode`,
        message: ERROR_MESSAGES.COUNTRY_CODE_REQUIRED
      });
    }
  });

  return errors;
};

export const validateImportData = (data: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Basic validation for imported data
  if (!data.firstName && !data.lastName && !data.corporateName) {
    errors.push({
      field: 'name',
      message: 'Either individual name or company name is required'
    });
  }

  if (data.email) {
    const emailChannel = getChannelByCode('email');
    if (emailChannel && !validateChannelValue(emailChannel, data.email)) {
      errors.push({
        field: 'email',
        message: ERROR_MESSAGES.INVALID_EMAIL
      });
    }
  }

  if (data.phone || data.mobile) {
    const phoneChannel = getChannelByCode(data.mobile ? 'mobile' : 'phone');
    if (phoneChannel && !validateChannelValue(phoneChannel, data.phone || data.mobile)) {
      errors.push({
        field: data.mobile ? 'mobile' : 'phone',
        message: ERROR_MESSAGES.INVALID_PHONE
      });
    }
  }

  return errors;
};

// Helper function to check if form has errors for a specific field
export const hasFieldError = (errors: ValidationError[], fieldName: string): boolean => {
  return errors.some(error => error.field === fieldName);
};

// Helper function to get error message for a specific field
export const getFieldError = (errors: ValidationError[], fieldName: string): string | undefined => {
  const error = errors.find(error => error.field === fieldName);
  return error?.message;
};

// Helper function to check if form data has been modified
export const isFormDirty = (original: ContactFormData, current: ContactFormData): boolean => {
  return JSON.stringify(original) !== JSON.stringify(current);
};