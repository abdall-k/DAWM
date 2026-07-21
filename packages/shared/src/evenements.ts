import { getSupabase } from "./supabaseClient";
import { Evenement, NouvelEvenementInput } from "./types";

export async function getEvenements(): Promise<Evenement[]> {
  const { data, error } = await getSupabase()
    .from("evenements")
    .select("*, profiles(nom)")
    .order("date_debut", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Evenement[];
}

export async function creerEvenement(input: NouvelEvenementInput): Promise<void> {
  const { error } = await getSupabase().from("evenements").insert(input);
  if (error) throw error;
}

export async function supprimerEvenement(id: number): Promise<void> {
  const { error } = await getSupabase().from("evenements").delete().eq("id", id);
  if (error) throw error;
}