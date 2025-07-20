// src/utils/constants/currencies.ts

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  isDefault?: boolean;
}

export const currencyOptions: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', isDefault: false },
  { code: 'EUR', name: 'Euro', symbol: '€', isDefault: false },
  { code: 'GBP', name: 'British Pound', symbol: '£', isDefault: false },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', isDefault: true },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', isDefault: false },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', isDefault: false },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', isDefault: false },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', isDefault: false },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', isDefault: false },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', isDefault: false },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', isDefault: false },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', isDefault: false },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', isDefault: false },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', isDefault: false },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', isDefault: false },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', isDefault: false },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', isDefault: false },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', isDefault: false }
];

// Helper function to get the default currency
export const getDefaultCurrency = (): Currency => {
  const defaultCurrency = currencyOptions.find(currency => currency.isDefault);
  return defaultCurrency || currencyOptions[0];
};

// Helper function to get currency by code
export const getCurrencyByCode = (code: string): Currency | undefined => {
  return currencyOptions.find(currency => currency.code === code);
};

// Helper function to get currency symbol
export const getCurrencySymbol = (code: string): string => {
  const currency = getCurrencyByCode(code);
  return currency?.symbol || '$';
};