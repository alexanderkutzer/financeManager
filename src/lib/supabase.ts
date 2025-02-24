import { createClient } from '@supabase/supabase-js';

// Default to empty strings if environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create client only if credentials are available
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const isSupabaseConfigured = () => {
  return !!supabase;
};