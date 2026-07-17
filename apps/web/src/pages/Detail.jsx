import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./Detail.module.css";
import BoutonInscription from "../components/BoutonInscription";

// 1. Correction : On récupère "session" depuis les props du composant parent
const Detail = ({ evenements, session }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 2. Correction : Si tes ID Supabase sont des chaînes (UUID), retire Number(). 
  // Si ce sont de simples entiers (1, 2, 3), tu peux laisser Number(id).
  const evenement = evenements.find((ev) => String(ev.id) === String(id));

  if (!evenement) {
    return (
      <div className={styles.container}>
        <p>Événement introuvable.</p>
        <Link to="/" className={styles.retour}>Retour à la liste</Link>
      </div>
    );
  }

  const prix = evenement.prix === 0 ? " Gratuit " : `${evenement.prix} FCFA`;
  const date = new Date(evenement.date_debut).toLocaleString("fr-FR");

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.retour}>
        &lt;- Retour
      </button>
      <h1 className={styles.titre}>{evenement.titre}</h1>
      <p className={styles.meta}>
        <span className={styles.categorie}>{evenement.categorie}</span>
      </p>
      
      {/* Petit conseil : N'affiche l'image que si elle existe dans ta base de données */}
      {evenement.image_url && (
        <img
          src={evenement.image_url}
          alt={evenement.titre}
          className={styles.image}
        />
      )}
      
      <dl className={styles.infos}>
        <dt>Lieu</dt> <dd>{evenement.lieu_nom}</dd>
        <dt>Date</dt> <dd>{date}</dd>
        <dt>Prix</dt> <dd className={styles.prix}>{prix}</dd>
      </dl>
      
      {/* "session" fonctionne correctement maintenant qu'il est défini en haut */}
      <BoutonInscription evenementId={evenement.id} session={session} />
    </div>
  );
};

export default Detail;