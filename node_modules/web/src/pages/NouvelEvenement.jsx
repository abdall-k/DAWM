import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import styles from "./NouvelEvenement.module.css";

const NouvelEvenement = ({ onAjoutReussi }) => {
  const [titre, setTitre] = useState("");
  const [categorie, setCategorie] = useState("concert");
  const [lieu, setLieu] = useState("");
  const [prix, setPrix] = useState(0);
  const [erreurs, setErreurs] = useState({});
  const [erreurServeur, setErreurServeur] = useState(null);
  const [enCours, setEnCours] = useState(false);
  const [fichier, setFichier] = useState(null);
  const navigate = useNavigate();

  const valider = () => {
    const e = {};
    if (titre.trim().length < 3) e.titre = "Le titre doit contenir au moins 3 caractères.";
    if (lieu.trim().length < 2) e.lieu = "Le lieu est requis.";
    if (prix < 0) e.prix = "Le prix ne peut pas être négatif.";
    return e;
  };

  const soumettre = async (event) => {
    event.preventDefault();
    setErreurServeur(null);
    setErreurs({});

    const erreursTrouvees = valider();
    if (Object.keys(erreursTrouvees).length > 0) {
      setErreurs(erreursTrouvees);
      return;
    }

    setEnCours(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErreurServeur("Vous devez être connecté.");
      setEnCours(false);
      return;
    }

    // --- Ajout : upload de l'image avant l'insert ---
    let image_url = null;
    if (fichier) {
      const chemin = `${user.id}/${Date.now()}_${fichier.name}`;
      const { error: eUp } = await supabase.storage
        .from("affiches")
        .upload(chemin, fichier);

      if (eUp) {
        setErreurServeur(eUp.message);
        setEnCours(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("affiches")
        .getPublicUrl(chemin);

      image_url = urlData.publicUrl;
    }
    // --- Fin ajout ---

    const { error } = await supabase.from("evenements").insert({
      titre: titre.trim(),
      categorie,
      lieu_nom: lieu.trim(),
      prix: Number(prix),
      date_debut: new Date().toISOString(),
      organisateur_id: user.id,
      image_url, // --- Ajout ---
    });

    setEnCours(false);

    if (error) {
      setErreurServeur(error.message);
    } else {
      onAjoutReussi();
      navigate("/");
    }
  };

  return (
    <form className={styles.form} onSubmit={soumettre}>
      <h2>Ajouter un événement</h2>

      {erreurServeur && <p className={styles.erreurBloc}>{erreurServeur}</p>}

      <label className={styles.champ}>
        Titre
        <input
          type="text"
          value={titre}
          onChange={e => setTitre(e.target.value)}
        />
        {erreurs.titre && <span className={styles.erreur}>{erreurs.titre}</span>}
      </label>

      <label className={styles.champ}>
        Catégorie
        <select value={categorie} onChange={e => setCategorie(e.target.value)}>
          <option value="concert">Concert</option>
          <option value="expo">Exposition</option>
          <option value="conference">Conférence</option>
          <option value="atelier">Atelier</option>
          <option value="soutenance">Soutenance</option>
        </select>
      </label>

      <label className={styles.champ}>
        Lieu
        <input
          type="text"
          value={lieu}
          onChange={e => setLieu(e.target.value)}
        />
        {erreurs.lieu && <span className={styles.erreur}>{erreurs.lieu}</span>}
      </label>

      <label className={styles.champ}>
        Prix (FCFA, 0 pour gratuit)
        <input
          type="number"
          min="0"
          value={prix}
          onChange={e => setPrix(e.target.value)}
        />
        {erreurs.prix && <span className={styles.erreur}>{erreurs.prix}</span>}
      </label>

      {/* --- Ajout : champ fichier --- */}
      <label className={styles.champ}>
        Affiche (image, optionnel)
        <input
          type="file"
          accept="image/*"
          onChange={e => setFichier(e.target.files[0])}
        />
      </label>

      <button type="submit" className={styles.bouton} disabled={enCours}>
        {enCours ? "Ajout en cours..." : "Ajouter"}
      </button>
    </form>
  );
};

export default NouvelEvenement;