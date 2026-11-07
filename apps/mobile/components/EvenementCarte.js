import { Link } from "expo-router";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";

const COULEURS_CATEGORIE = {
  concert: "#e74c3c",
  expo: "#9b59b6",
  conference: "#2980b9",
  atelier: "#27ae60",
  soutenance: "#f39c12",
};

export default function EvenementCarte({ evenement }) {
  const prix = evenement.prix === 0 ? "Gratuit" : `${evenement.prix} FCFA`;
  const couleurCategorie = COULEURS_CATEGORIE[evenement.categorie] || "#ea7d2b";
  const date = new Date(evenement.date_debut).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });

  return (
    <Link href={`/evenement/${evenement.id}`} asChild>
      <Pressable style={styles.carte}>
        {evenement.image_url ? (
          <Image source={{ uri: evenement.image_url }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.imagePlaceholderTexte}>📅</Text>
          </View>
        )}

        <View style={styles.dateBadge}>
          <Text style={styles.dateBadgeTexte}>{date}</Text>
        </View>

        <View style={styles.contenu}>
          <Text style={styles.titre} numberOfLines={1}>{evenement.titre}</Text>
          <Text style={styles.lieu}>📍 {evenement.lieu_nom}</Text>

          <View style={styles.pied}>
            <View style={[styles.categorie, { backgroundColor: couleurCategorie }]}>
              <Text style={styles.categorieTexte}>{evenement.categorie}</Text>
            </View>
            <Text style={styles.prix}>{prix}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  carte: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  image: {
    width: "100%",
    height: 160,
  },
  imagePlaceholder: {
    backgroundColor: "#e8eef4",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderTexte: {
    fontSize: 36,
  },
  dateBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(26,58,92,0.9)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dateBadgeTexte: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  contenu: {
    padding: 14,
  },
  titre: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1a3a5c",
  },
  lieu: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  pied: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  categorie: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categorieTexte: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  prix: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#ea7d2b",
  },
});