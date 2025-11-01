import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Replace with your Supabase project URL and anon key
const SUPABASE_URL = "https://hyifsxeiigbkjpscfoxe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5aWZzeGVpaWdia2pwc2Nmb3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODIzNjcsImV4cCI6MjA3NzU1ODM2N30.OiaRw1C0kOxddxka863qZJHlGmhyr4Q-sN-r8qWrbEw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
