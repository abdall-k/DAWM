import { useState, useEffect } from "react";
import {
  StyleSheet, Text, View, FlatList,
  ActivityIndicator, SafeAreaView, StatusBar as RNStatusBar,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { initSupabase, getEvenements } from "@senevent/shared";
import EvenementCarte from "./components/EvenementCarte";

initSupabase(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

export default function App() {
  const [evenements, setEvenements] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    const charger = async () => {
      try {
        const data = await getEvenements();
        setEvenements(data);
      } catch (e) {
        setErreur(e.message);
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.entete}>
        <Text style={styles.logo}>🎉 SénEvent</Text>
        <Text style={styles.sousTitre}>Découvrez les événements à Dakar</Text>
        {!chargement && !erreur && (
          <Text style={styles.compteur}>
            {evenements.length} événement{evenements.length > 1 ? "s" : ""} à venir
          </Text>
        )}
      </View>

      {chargement && (
        <View style={styles.centre}>
          <ActivityIndicator size="large" color="#1a3a5c" />
          <Text style={styles.chargementTexte}>Chargement des événements...</Text>
        </View>
      )}

      {erreur && (
        <View style={styles.centre}>
          <Text style={styles.erreurIcone}>⚠️</Text>
          <Text style={styles.erreur}>Erreur : {erreur}</Text>
        </View>
      )}

      {!chargement && !erreur && (
        <FlatList
          data={evenements}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <EvenementCarte evenement={item} />}
          contentContainerStyle={styles.liste}
          showsVerticalScrollIndicator={false}
        />
      )}

      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    paddingTop: RNStatusBar.currentHeight,
  },
  entete: {
    padding: 20,
    paddingBottom: 24,
    backgroundColor: "#1a3a5c",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  logo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },
  sousTitre: {
    fontSize: 14,
    color: "#a8c5e0",
    marginTop: 4,
  },
  compteur: {
    fontSize: 12,
    color: "#ea7d2b",
    fontWeight: "600",
    marginTop: 10,
  },
  liste: {
    paddingVertical: 12,
    paddingBottom: 24,
  },
  centre: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  chargementTexte: {
    marginTop: 12,
    color: "#666",
    fontSize: 14,
  },
  erreurIcone: {
    fontSize: 32,
    marginBottom: 8,
  },
  erreur: {
    color: "#a01a1a",
    textAlign: "center",
    fontSize: 14,
  },
});