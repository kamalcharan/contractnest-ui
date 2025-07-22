// src/utils/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Direct access - bypass env.ts for now
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

console.log('Direct VITE_SUPABASE_URL:', supabaseUrl);
console.log('Direct VITE_SUPABASE_KEY:', supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing vars - URL:', supabaseUrl, 'KEY:', supabaseAnonKey);
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);