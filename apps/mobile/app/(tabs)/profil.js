import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import {
  mesInscriptions,
  seConnecter,
  seDeconnecter,
  sInscrire,
} from "@senevent/shared";
import { useAuth } from "../../context/AuthContext";

export default function ProfilScreen() {
  const { session, chargement } = useAuth();

  if (chargement) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.centre} />
      </View>
    );
  }

  return session ? <ProfilConnecte session={session} /> : <FormulaireAuth />;
}

function ProfilConnecte({ session }) {
  const [inscriptions, setInscriptions] = useState([]);
  const [chargementInscriptions, setChargementInscriptions] = useState(true);
  const [erreurInscriptions, setErreurInscriptions] = useState(null);
  const [erreurDeconnexion, setErreurDeconnexion] = useState("");

  useFocusEffect(
    useCallback(() => {
      let actif = true;

      async function chargerInscriptions() {
        setChargementInscriptions(true);
        setErreurInscriptions(null);
        try {
          const resultats = await mesInscriptions(session.user.id);
          if (actif) {
            setInscriptions(resultats);
          }
        } catch (error) {
          if (actif) {
            setErreurInscriptions(error.message);
          }
        } finally {
          if (actif) {
            setChargementInscriptions(false);
          }
        }
      }

      chargerInscriptions();
      return () => {
        actif = false;
      };
    }, [session.user.id])
  );

  async function handleDeconnexion() {
    setErreurDeconnexion("");
    try {
      await seDeconnecter();
    } catch (error) {
      setErreurDeconnexion(
        error instanceof Error ? error.message : "Une erreur est survenue."
      );
    }
  }

  return (
    <FlatList
      style={styles.profilContainer}
      contentContainerStyle={styles.profilContenu}
      data={inscriptions}
      keyExtractor={(item) => item.evenement_id.toString()}
      ListHeaderComponent={
        <>
          <Text style={styles.titre}>Mon profil</Text>
          <Text style={styles.email}>{session.user.email}</Text>
          {erreurDeconnexion ? (
            <Text style={styles.erreur}>{erreurDeconnexion}</Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            onPress={handleDeconnexion}
            style={styles.boutonDeco}
          >
            <Text style={styles.boutonTexte}>Se deconnecter</Text>
          </Pressable>
          <Text style={styles.titreInscriptions}>Mes inscriptions</Text>
          {erreurInscriptions ? (
            <Text style={styles.erreurListe}>{erreurInscriptions}</Text>
          ) : null}
        </>
      }
      renderItem={({ item }) => (
        <View style={styles.ligneInscription}>
          <Text style={styles.titreEvenement}>{item.evenements.titre}</Text>
          <Text style={styles.dateEvenement}>
            {new Date(item.evenements.date_debut).toLocaleDateString("fr-FR")}
          </Text>
        </View>
      )}
      ListEmptyComponent={
        chargementInscriptions ? (
          <ActivityIndicator style={styles.centre} color="#1a3a5c" />
        ) : erreurInscriptions ? null : (
          <Text style={styles.vide}>Aucune inscription.</Text>
        )
      }
    />
  );
}

function FormulaireAuth() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const estInscription = mode === "signup";

  async function handleSoumission() {
    setErreur("");
    setEnvoi(true);
    try {
      if (estInscription) {
        await sInscrire(email, motDePasse);
      } else {
        await seConnecter(email, motDePasse);
      }
    } catch (error) {
      setErreur(
        error instanceof Error ? error.message : "Une erreur est survenue."
      );
    } finally {
      setEnvoi(false);
    }
  }

  function basculerMode() {
    setErreur("");
    setMode(estInscription ? "login" : "signup");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.titre}>
        {estInscription ? "Creer un compte" : "Se connecter"}
      </Text>
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        value={email}
      />
      <TextInput
        onChangeText={setMotDePasse}
        placeholder="Mot de passe"
        secureTextEntry
        style={styles.input}
        value={motDePasse}
      />
      {erreur ? <Text style={styles.erreur}>{erreur}</Text> : null}
      <Pressable
        accessibilityRole="button"
        disabled={envoi}
        onPress={handleSoumission}
        style={styles.bouton}
      >
        <Text style={styles.boutonTexte}>
          {envoi
            ? "..."
            : estInscription
              ? "Creer le compte"
              : "Se connecter"}
        </Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={basculerMode}>
        <Text style={styles.basculer}>
          {estInscription
            ? "Deja un compte ? Se connecter"
            : "Pas de compte ? En creer un"}
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
  },
  profilContainer: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  profilContenu: {
    padding: 24,
  },
  centre: {
    marginTop: 40,
  },
  titre: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a3a5c",
    marginBottom: 20,
    textAlign: "center",
  },
  email: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  bouton: {
    backgroundColor: "#1a3a5c",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  boutonDeco: {
    backgroundColor: "#ea7d2b",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  boutonTexte: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  basculer: {
    color: "#3949ab",
    textAlign: "center",
    marginTop: 16,
  },
  erreur: {
    color: "#a01a1a",
    textAlign: "center",
    marginBottom: 12,
  },
  titreInscriptions: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a3a5c",
    marginTop: 28,
    marginBottom: 12,
  },
  ligneInscription: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  titreEvenement: {
    color: "#1a3a5c",
    fontSize: 16,
    fontWeight: "600",
  },
  dateEvenement: {
    color: "#666",
    marginTop: 4,
  },
  erreurListe: {
    color: "#a01a1a",
    marginBottom: 12,
  },
  vide: {
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
});
