import { createClient } from "@supabase/supabase-js";

// 🔹 Usa import.meta.env (padrão Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🔹 Cria e exporta o cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
