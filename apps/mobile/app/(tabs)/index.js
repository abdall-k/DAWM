import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { getEvenements } from "@senevent/shared";
import EvenementCarte from "../../components/EvenementCarte";

const CATEGORIES = [
  { valeur: "tous", label: "Tous" },
  { valeur: "concert", label: "Concert" },
  { valeur: "expo", label: "Expo" },
  { valeur: "conference", label: "Conférence" },
  { valeur: "atelier", label: "Atelier" },
  { valeur: "soutenance", label: "Soutenance" },
];

export default function EvenementsScreen() {
  const [evenements, setEvenements] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [categorie, setCategorie] = useState("tous");
  const [tarif, setTarif] = useState("tous");
  const [periode, setPeriode] = useState("tous");

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

  const evenementsFiltres = evenements
    .filter((evenement) => {
      const terme = recherche.trim().toLocaleLowerCase("fr");
      const correspondRecherche =
        !terme ||
        [evenement.titre, evenement.lieu_nom, evenement.categorie]
          .some((valeur) => valeur.toLocaleLowerCase("fr").includes(terme));
      const correspondCategorie =
        categorie === "tous" || evenement.categorie === categorie;
      const correspondTarif =
        tarif === "tous" ||
        (tarif === "gratuit" ? evenement.prix === 0 : evenement.prix > 0);
      const estAVenir = new Date(evenement.date_debut) >= new Date();
      const correspondPeriode =
        periode === "tous" ||
        (periode === "avenir" ? estAVenir : !estAVenir);

      return correspondRecherche && correspondCategorie && correspondTarif && correspondPeriode;
    })
    .sort(
      (a, b) =>
        new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime()
    );

  const reinitialiserFiltres = () => {
    setRecherche("");
    setCategorie("tous");
    setTarif("tous");
    setPeriode("tous");
  };

  const entete = (
    <>
      <View style={styles.entete}>
        <View style={styles.logoLigne}>
          <View style={styles.logoIcone}>
            <Ionicons name="sparkles" size={21} color="#fff" />
          </View>
          <Text style={styles.logo}>SénEvent</Text>
        </View>
        <Text style={styles.sousTitre}>Les meilleures sorties à Dakar</Text>
        <View style={styles.compteurBloc}>
          <Text style={styles.compteur}>{evenements.length}</Text>
          <Text style={styles.compteurLibelle}>événements à découvrir</Text>
        </View>
      </View>

      <View style={styles.filtres}>
        <Text style={styles.titreSection}>Trouve ton événement</Text>
        <View style={styles.recherche}>
          <Ionicons name="search" size={20} color="#728197" />
          <TextInput
            value={recherche}
            onChangeText={setRecherche}
            placeholder="Événement, lieu..."
            placeholderTextColor="#8a98a9"
            style={styles.champRecherche}
            returnKeyType="search"
            accessibilityLabel="Rechercher un événement ou un lieu"
          />
          {recherche.length > 0 && (
            <Pressable
              onPress={() => setRecherche("")}
              accessibilityRole="button"
              accessibilityLabel="Effacer la recherche"
              hitSlop={8}
            >
              <Ionicons name="close-circle" size={19} color="#8a98a9" />
            </Pressable>
          )}
        </View>

        <Text style={styles.titreFiltre}>Catégories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listeCategories}
        >
          {CATEGORIES.map((item) => {
            const active = categorie === item.valeur;
            return (
              <Pressable
                key={item.valeur}
                onPress={() => setCategorie(item.valeur)}
                style={[styles.puce, active && styles.puceActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.puceTexte, active && styles.puceTexteActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.titreFiltre}>Date</Text>
        <View style={styles.filtresPrix}>
          {[
            { valeur: "tous", label: "Toutes les dates" },
            { valeur: "avenir", label: "À venir" },
            { valeur: "passe", label: "Passés" },
          ].map((item) => {
            const active = periode === item.valeur;
            return (
              <Pressable
                key={item.valeur}
                onPress={() => setPeriode(item.valeur)}
                style={[styles.pucePrix, active && styles.pucePrixActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.pucePrixTexte, active && styles.pucePrixTexteActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.ligneResultats}>
          <Text style={styles.resultats}>
            {evenementsFiltres.length} résultat{evenementsFiltres.length > 1 ? "s" : ""}
          </Text>
          <View style={styles.filtresPrix}>
            {[
              { valeur: "tous", label: "Tous les prix" },
              { valeur: "gratuit", label: "Gratuit" },
              { valeur: "payant", label: "Payant" },
            ].map((item) => {
              const active = tarif === item.valeur;
              return (
                <Pressable
                  key={item.valeur}
                  onPress={() => setTarif(item.valeur)}
                  style={[styles.pucePrix, active && styles.pucePrixActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.pucePrixTexte, active && styles.pucePrixTexteActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </>
  );

  if (chargement) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator size="large" color="#1a3a5c" />
        <Text style={styles.chargementTexte}>Chargement des événements...</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  if (erreur) {
    return (
      <View style={styles.page}>
        {entete}
        <View style={styles.centre}>
          <Text style={styles.erreurIcone}>⚠️</Text>
          <Text style={styles.erreur}>Erreur : {erreur}</Text>
        </View>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <FlatList
        data={evenementsFiltres}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <EvenementCarte evenement={item} />}
        ListHeaderComponent={entete}
        ListEmptyComponent={
          <View style={styles.vide}>
            <View style={styles.videIcone}>
              <Ionicons name="search-outline" size={28} color="#728197" />
            </View>
            <Text style={styles.videTitre}>Aucun événement trouvé</Text>
            <Text style={styles.videDescription}>
              Essaie un autre mot-clé ou modifie tes filtres.
            </Text>
            <Pressable
              onPress={reinitialiserFiltres}
              style={styles.boutonReinitialiser}
              accessibilityRole="button"
            >
              <Text style={styles.boutonReinitialiserTexte}>Réinitialiser les filtres</Text>
            </Pressable>
          </View>
        }
        contentContainerStyle={styles.liste}
        showsVerticalScrollIndicator={false}
      />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  entete: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 26,
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
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
  },
  logoLigne: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoIcone: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  sousTitre: {
    fontSize: 14,
    color: "#a8c5e0",
    marginTop: 8,
  },
  compteurBloc: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 7,
    marginTop: 20,
  },
  compteur: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "bold",
  },
  compteurLibelle: {
    color: "#c8d7e7",
    fontSize: 13,
  },
  filtres: {
    paddingTop: 22,
    paddingBottom: 6,
  },
  titreSection: {
    marginHorizontal: 18,
    marginBottom: 14,
    color: "#1a3a5c",
    fontSize: 19,
    fontWeight: "bold",
  },
  recherche: {
    minHeight: 50,
    marginHorizontal: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e4eaf0",
  },
  champRecherche: {
    flex: 1,
    paddingVertical: 12,
    color: "#1a3a5c",
    fontSize: 14,
  },
  titreFiltre: {
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 10,
    color: "#1a3a5c",
    fontSize: 14,
    fontWeight: "700",
  },
  listeCategories: {
    paddingHorizontal: 16,
    gap: 8,
  },
  puce: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 18,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e4eaf0",
  },
  puceActive: {
    backgroundColor: "#1a3a5c",
    borderColor: "#1a3a5c",
  },
  puceTexte: {
    color: "#526176",
    fontSize: 13,
    fontWeight: "600",
  },
  puceTexteActive: {
    color: "#fff",
  },
  ligneResultats: {
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 2,
  },
  resultats: {
    marginBottom: 10,
    color: "#728197",
    fontSize: 12,
    fontWeight: "600",
  },
  filtresPrix: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pucePrix: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: "#e8eef4",
  },
  pucePrixActive: {
    backgroundColor: "#fff0e5",
  },
  pucePrixTexte: {
    color: "#526176",
    fontSize: 11,
    fontWeight: "600",
  },
  pucePrixTexteActive: {
    color: "#c75d17",
  },
  vide: {
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 42,
  },
  videIcone: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#e5ebf1",
  },
  videTitre: {
    marginTop: 16,
    color: "#1a3a5c",
    fontSize: 17,
    fontWeight: "bold",
  },
  videDescription: {
    marginTop: 7,
    color: "#728197",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
  boutonReinitialiser: {
    marginTop: 17,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#1a3a5c",
  },
  boutonReinitialiserTexte: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  liste: {
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
