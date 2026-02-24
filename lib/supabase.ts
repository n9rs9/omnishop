import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// On vérifie que les variables existent bien
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Il manque les variables d'environnement Supabase !")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)