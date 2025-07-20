//src/config/theme/index.ts

import { BharathaVarshaTheme } from './themes/bharathavarshaTheme';
import { ClassicElegantTheme } from './themes/classicElegantTheme';
import { PurpleToneTheme } from './themes/purpleToneTheme';

export const themes = {
  [BharathaVarshaTheme.id]: BharathaVarshaTheme,
  [ClassicElegantTheme.id]: ClassicElegantTheme,
  [PurpleToneTheme.id]: PurpleToneTheme,
};

export const defaultTheme = BharathaVarshaTheme;