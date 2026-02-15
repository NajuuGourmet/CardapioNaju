import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mwnrnqhmymrmlzkymuoy.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13bnJucWhteW1ybWx6a3ltdW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4ODg2NzgsImV4cCI6MjA4NTQ2NDY3OH0.yYCjnT1A0694ETiAEEY5JhuWJX5miZvW-mbE8I-5xes'

export function createClient() {
  return createBrowserClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
  )
}
