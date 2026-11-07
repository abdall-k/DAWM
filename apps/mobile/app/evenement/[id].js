import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getEvenements } from "@senevent/shared";

export default function DetailEvenementScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [evenement, setEvenement] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    const charger = async () => {
      try {
        const evenements = await getEvenements();
        setEvenement(evenements.find((ev) => ev.id === Number(id)) ?? null);
      } catch (e) {
        setErreur(e.message);
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, [id]);

  if (chargement) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator size="large" color="#1a3a5c" />
      </View>
    );
  }

  if (erreur) {
    return (
      <View style={styles.centre}>
        <Text style={styles.message}>Erreur : {erreur}</Text>
      </View>
    );
  }

  if (!evenement) {
    return (
      <View style={styles.centre}>
        <Text style={styles.message}>Evenement introuvable.</Text>
        <BoutonRetour onPress={() => router.push("/")} />
      </View>
    );
  }

  const prix = evenement.prix === 0 ? "Gratuit" : `${evenement.prix} FCFA`;
  const date = new Date(evenement.date_debut).toLocaleString("fr-FR");

  return (
    <ScrollView contentContainerStyle={styles.contenu}>
      {evenement.image_url ? (
        <Image source={{ uri: evenement.image_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.imagePlaceholderTexte}>📅</Text>
        </View>
      )}
      <Text style={styles.titre}>{evenement.titre}</Text>
      <View style={styles.categorie}>
        <Text style={styles.categorieTexte}>{evenement.categorie}</Text>
      </View>
      <View style={styles.infos}>
        <Ligne label="Lieu" valeur={evenement.lieu_nom} />
        <Ligne label="Date" valeur={date} />
        <Ligne label="Prix" valeur={prix} />
      </View>
      <BoutonRetour onPress={() => router.push("/")} />
    </ScrollView>
  );
}

function Ligne({ label, valeur }) {
  return (
    <View style={styles.ligne}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.valeur}>{valeur}</Text>
    </View>
  );
}

function BoutonRetour({ onPress }) {
  return (
    <Pressable style={styles.boutonRetour} onPress={onPress}>
      <Text style={styles.boutonRetourTexte}>Retour a la liste</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  centre: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f0f4f8",
  },
  contenu: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f0f4f8",
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 14,
  },
  imagePlaceholder: {
    backgroundColor: "#e8eef4",
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderTexte: {
    fontSize: 48,
  },
  titre: {
    marginTop: 20,
    color: "#1a3a5c",
    fontSize: 24,
    fontWeight: "bold",
  },
  categorie: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#1a3a5c",
  },
  categorieTexte: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  infos: {
    marginTop: 24,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#fff",
  },
  ligne: {
    paddingVertical: 10,
  },
  label: {
    color: "#666",
    fontSize: 13,
  },
  valeur: {
    marginTop: 4,
    color: "#1a3a5c",
    fontSize: 16,
    fontWeight: "600",
  },
  message: {
    marginBottom: 16,
    color: "#1a3a5c",
    fontSize: 16,
    textAlign: "center",
  },
  boutonRetour: {
    alignItems: "center",
    marginTop: 24,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#1a3a5c",
  },
  boutonRetourTexte: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
