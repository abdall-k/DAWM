import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { creerEvenement } from "@senevent/shared";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["concert", "expo", "conference", "atelier", "soutenance"];

export default function NouveauEvenementScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const [titre, setTitre] = useState("");
  const [categorie, setCategorie] = useState("concert");
  const [lieu, setLieu] = useState("");
  const [prix, setPrix] = useState("0");
  const [erreur, setErreur] = useState(null);
  const [enCours, setEnCours] = useState(false);

  async function soumettre() {
    setErreur(null);

    if (titre.trim().length < 3) {
      setErreur("Le titre doit faire au moins 3 caracteres.");
      return;
    }

    if (!session) {
      setErreur("Vous devez etre connecte.");
      return;
    }

    setEnCours(true);
    try {
      await creerEvenement({
        titre: titre.trim(),
        categorie,
        lieu_nom: lieu.trim(),
        date_debut: new Date().toISOString(),
        prix: Number(prix) || 0,
        organisateur_id: session.user.id,
      });
      router.back();
    } catch (e) {
      setErreur(e.message);
    } finally {
      setEnCours(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.contenu}>
        <Text style={styles.label}>Titre</Text>
        <TextInput
          onChangeText={setTitre}
          style={styles.input}
          value={titre}
        />

        <Text style={styles.label}>Categorie</Text>
        <View style={styles.categories}>
          {CATEGORIES.map((c) => {
            const selectionnee = categorie === c;
            return (
              <Pressable
                key={c}
                onPress={() => setCategorie(c)}
                style={[styles.chip, selectionnee && styles.chipActif]}
              >
                <Text
                  style={
                    selectionnee ? styles.chipTexteActif : styles.chipTexte
                  }
                >
                  {c}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Lieu</Text>
        <TextInput
          onChangeText={setLieu}
          style={styles.input}
          value={lieu}
        />

        <Text style={styles.label}>Prix (FCFA, 0 = gratuit)</Text>
        <TextInput
          keyboardType="numeric"
          onChangeText={setPrix}
          style={styles.input}
          value={prix}
        />

        {erreur ? <Text style={styles.erreur}>{erreur}</Text> : null}

        <Pressable
          disabled={enCours}
          onPress={soumettre}
          style={styles.bouton}
        >
          <Text style={styles.boutonTexte}>
            {enCours ? "Envoi..." : "Ajouter l'evenement"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contenu: { padding: 16 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a3a5c",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  categories: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipActif: { backgroundColor: "#1a3a5c", borderColor: "#1a3a5c" },
  chipTexte: { color: "#444", fontSize: 13 },
  chipTexteActif: { color: "#fff", fontSize: 13 },
  bouton: {
    backgroundColor: "#1a3a5c",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  boutonTexte: { color: "#fff", fontSize: 16, fontWeight: "600" },
  erreur: { color: "#a01a1a", marginTop: 12 },
});
