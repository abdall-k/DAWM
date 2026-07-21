import { useState, useEffect } from "react";
import { estInscrit, inscrire, desinscrire } from "@senevent/shared";
import styles from "./BoutonInscription.module.css";

const BoutonInscription = ({ evenementId, session }) => {
  const [inscrit, setInscrit] = useState(false);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const verifier = async () => {
      if (!session) {
        setChargement(false);
        return;
      }
      const deja = await estInscrit(evenementId, session.user.id);
      setInscrit(deja);
      setChargement(false);
    };
    verifier();
  }, [evenementId, session]);

  const sInscrire = async () => {
    try {
      await inscrire(evenementId, session.user.id);
      setInscrit(true);
    } catch (e) {
      alert("Erreur : " + e.message);
    }
  };

  const seDesinscrire = async () => {
    try {
      await desinscrire(evenementId, session.user.id);
      setInscrit(false);
    } catch (e) {
      alert("Erreur : " + e.message);
    }
  };

  if (!session) return <p className={styles.info}>Connectez-vous pour vous inscrire.</p>;
  if (chargement) return <p className={styles.info}>...</p>;

  return inscrit ? (
    <button onClick={seDesinscrire} className={styles.desinscrire}>Se desinscrire</button>
  ) : (
    <button onClick={sInscrire} className={styles.inscrire}>S'inscrire</button>
  );
};

export default BoutonInscription;