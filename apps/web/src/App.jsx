import { useState, useEffect } from "react";
import EvenementCarte from "./components/EvenementCarte";
import SearchBar from "./components/SearchBar";
import styles from "./App.module.css";

const App = () => {
  const [evenements, setEvenements] = useState ([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState("");

  const charger = async() => {
    setChargement(true);
    setErreur(null);
    try {
      const reponse = await fetch("/evenements.json");
      if (!reponse.ok) {
        throw new Error(`Erreur HTTP ${reponse.status}`);
      }
      const data = await reponse.json();
      setEvenements(data);
    } catch (e) {
      setErreur(e.message);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    charger();
  }, []);

  const evenementsFiltres = evenements.filter(ev =>
    ev.titre.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.titre}>SenEvent Evenements a Dakar</h1>

      {chargement && (
        <p className={styles.message}>Chargement des evenements...</p>
      )}

      {erreur && (
        <div className={styles.erreur}>
          <p>Erreur {erreur}</p>
          <button className={styles.bouton} onClick={charger}>
            Reessayer
          </button>
        </div>
      )}

      {!chargement && !erreur && (
        <>
          <SearchBar recherche={recherche} onRecherche={setRecherche} />
          <p className={styles.compteur}>
            {evenementsFiltres.length} evenement (s) trouve (s)
          </p>
          {evenementsFiltres.length == 0 ? (
            <p className={styles.message}>Aucun evenement ne correspond.</p>
          ) : (
            evenementsFiltres.map(ev => (
              <EvenementCarte key={ev.id} ev={ev} afficherDetails={true} />
            ))
          )}
        </>
      )}
    </div>
  );
};

export default App;