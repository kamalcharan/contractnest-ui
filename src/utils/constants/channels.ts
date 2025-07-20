//src/utils/contants/channels.ts

import { countries } from './countries';

export type ChannelValidationType = 'phone' | 'email' | 'url' | 'text' | 'social';

export interface ChannelValidation {
    type: ChannelValidationType;
    pattern?: RegExp;
    requiresCountryCode?: boolean;
    maxLength?: number;
    customValidation?: (value: string) => boolean;
}

export interface Channel {
    code: string;
    displayName: string;
    icon?: string;  // lucide icon name
    order: number;
    placeholder: string;
    validation: ChannelValidation;
}

export const CHANNELS: Channel[] = [
    {
        code: 'mobile',
        displayName: 'Mobile',
        icon: 'phone',
        order: 1,
        placeholder: 'Enter mobile number',
        validation: {
            type: 'phone',
            requiresCountryCode: true,
            pattern: /^\+?[1-9]\d{1,14}$/,  // E.164 format
            maxLength: 15
        }
    },
    {
        code: 'email',
        displayName: 'Email',
        icon: 'mail',
        order: 2,
        placeholder: 'Enter email address',
        validation: {
            type: 'email',
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        }
    },
    {
        code: 'whatsapp',
        displayName: 'WhatsApp',
        icon: 'message-circle',
        order: 3,
        placeholder: 'Enter WhatsApp number',
        validation: {
            type: 'phone',
            requiresCountryCode: true,
            pattern: /^\+?[1-9]\d{1,14}$/
        }
    },
    {
        code: 'linkedin',
        displayName: 'LinkedIn',
        icon: 'linkedin',
        order: 4,
        placeholder: 'Enter LinkedIn profile URL',
        validation: {
            type: 'url',
            pattern: /^https:\/\/[www.]*linkedin.com\/.*$/,
            customValidation: (url: string) => url.includes('linkedin.com')
        }
    },
    {
        code: 'twitter',
        displayName: 'Twitter',
        icon: 'twitter',
        order: 5,
        placeholder: '@username',
        validation: {
            type: 'social',
            pattern: /^@?[a-zA-Z0-9_]{1,15}$/,
            maxLength: 15
        }
    },
    {
        code: 'facebook',
        displayName: 'Facebook',
        icon: 'facebook',
        order: 6,
        placeholder: 'Enter Facebook profile URL or username',
        validation: {
            type: 'social',
            pattern: /^(?:https:\/\/(?:www\.)?facebook\.com\/|@?)[a-zA-Z0-9.]{1,50}$/
        }
    },
    {
        code: 'instagram',
        displayName: 'Instagram',
        icon: 'instagram',
        order: 7,
        placeholder: '@username',
        validation: {
            type: 'social',
            pattern: /^@?[a-zA-Z0-9_.]{1,30}$/,
            maxLength: 30
        }
    }
];

// Helper functions
export const getChannelByCode = (code: string): Channel | undefined => {
    return CHANNELS.find(c => c.code === code);
};

export const validateChannelValue = (
    channel: Channel, 
    value: string, 
    countryCode?: string
): boolean => {
    const { validation } = channel;
    
    // Check basic pattern
    if (validation.pattern && !validation.pattern.test(value)) {
        return false;
    }

    // Check length
    if (validation.maxLength && value.length > validation.maxLength) {
        return false;
    }

    // Check country code for phone numbers
    if (validation.requiresCountryCode && countryCode) {
        const country = countries.find(c => c.code === countryCode);
        if (!country) return false;
        
        // Remove any existing country code from value
        const cleanValue = value.replace(/^\+\d+/, '');
        if (!/^\d+$/.test(cleanValue)) return false;
    }

    // Run custom validation if exists
    if (validation.customValidation && !validation.customValidation(value)) {
        return false;
    }

    return true;
};

export const formatChannelValue = (
    channel: Channel,
    value: string,
    countryCode?: string
): string => {
    if (channel.validation.type === 'phone' && countryCode) {
        const country = countries.find(c => c.code === countryCode);
        if (country) {
            // Remove any existing country code and format
            const cleanValue = value.replace(/^\+\d+/, '').replace(/\D/g, '');
            return `+${country.phoneCode}${cleanValue}`;
        }
    }
    
    if (channel.validation.type === 'social' && !value.startsWith('@')) {
        return `@${value}`;
    }

    return value;
};