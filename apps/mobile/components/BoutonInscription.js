import { useState, useEffect } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { estInscrit, inscrire, desinscrire } from "@senevent/shared";
import { useAuth } from "../context/AuthContext";

export default function BoutonInscription({ evenementId }) {
  const { session } = useAuth();
  const [inscrit, setInscrit] = useState(false);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (!session) {
      setChargement(false);
      return;
    }

    estInscrit(evenementId, session.user.id).then((resultat) => {
      setInscrit(resultat);
      setChargement(false);
    });
  }, [evenementId, session]);

  async function basculer() {
    try {
      if (inscrit) {
        await desinscrire(evenementId, session.user.id);
        setInscrit(false);
      } else {
        await inscrire(evenementId, session.user.id);
        setInscrit(true);
      }
    } catch (e) {
      Alert.alert("Erreur", e.message);
    }
  }

  if (!session) {
    return (
      <Text style={styles.info}>
        Connectez-vous (onglet Profil) pour vous inscrire.
      </Text>
    );
  }

  if (chargement) {
    return <ActivityIndicator color="#1a3a5c" style={styles.marge} />;
  }

  return (
    <Pressable
      onPress={basculer}
      style={[
        styles.bouton,
        inscrit ? styles.desinscrire : styles.inscrire,
      ]}
    >
      <Text style={styles.texte}>
        {inscrit ? "Se desinscrire" : "S'inscrire a cet evenement"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bouton: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  inscrire: { backgroundColor: "#1f6b2c" },
  desinscrire: { backgroundColor: "#ea7d2b" },
  texte: { color: "#fff", fontSize: 16, fontWeight: "600" },
  info: {
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
  marge: { marginTop: 20 },
});
