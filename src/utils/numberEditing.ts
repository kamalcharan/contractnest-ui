import type { InputHTMLAttributes } from 'react';

// Keep native input semantics; select existing defaults and tidy pasted leading zeros.
export const numberEditing: Pick<InputHTMLAttributes<HTMLInputElement>, 'onFocus' | 'onBlur'> = {
  onFocus: event => event.currentTarget.select(),
  onBlur: event => {
    const input = event.currentTarget;
    if (input.value !== '' && Number.isFinite(Number(input.value))) input.value = String(Number(input.value));
  },
};
export const editableNumber = (value: unknown): string =>
  value === '' || value == null || !Number.isFinite(Number(value)) ? '' : String(value);
