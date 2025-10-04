import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://gcnhcrrbfkysxfunjiyk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjbmhjcnJiZmt5c3hmdW5qaXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTk2ODQsImV4cCI6MjA3NTE3NTY4NH0.vwobJGoGrLU3fhy8aodsPmEBfnCt2euJi7jfoESu7gU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
