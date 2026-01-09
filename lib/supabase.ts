import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ruzmlcidldldraanbdnk.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_rnBFWgQKRv81ASrvC1nG7w_BmIqR81i'

export const supabase = createClient(supabaseUrl, supabaseKey)
