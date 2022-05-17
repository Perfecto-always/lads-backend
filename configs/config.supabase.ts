import { createClient } from "@supabase/supabase-js";
import invariant from "tiny-invariant";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

invariant(supabaseUrl, "SUPABASE_URL is required");
invariant(supabaseAnonKey, "SUPABASE_ANON_KEY is required");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
