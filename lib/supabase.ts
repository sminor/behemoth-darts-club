import { createClient } from '@supabase/supabase-js'

// Provide fallback to prevent build errors during static generation if env vars are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

if (!supabaseUrl || !supabaseKey) {
    console.warn('Warning: Missing Supabase Environment Variables. Check your .env file or Netlify Site Configuration.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
