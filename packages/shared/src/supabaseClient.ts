import {
  createClient,
  SupabaseClient,
  SupabaseClientOptions,
} from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function initSupabase(
  url: string,
  anonKey: string,
  options?: SupabaseClientOptions<"public">
): SupabaseClient {
  if (!client) {
    client = createClient(url, anonKey, options);
  }
  return client;
}

export function getSupabase(): SupabaseClient {
  if (!client) {
    throw new Error(
      "Supabase non initialise. Appelez initSupabase(url, key) au demarrage."
    );
  }
  return client;
}