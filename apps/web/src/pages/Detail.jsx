import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./Detail.module.css";
import BoutonInscription from "../components/BoutonInscription";
import { supprimerEvenement } from "@senevent/shared";

const Detail = ({ evenements, session }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const evenement = evenements.find((ev) => String(ev.id) === String(id));

  const supprimer = async () => {
    const confirme = window.confirm("Supprimer cet evenement ?");
    if (!confirme) return;

    try {
      await supprimerEvenement(evenement.id);
      navigate("/");
    } catch (e) {
      alert("Erreur : " + e.message);
    }
  };

  if (!evenement) {
    return (
      <div className={styles.container}>
        <p>Événement introuvable.</p>
        <Link to="/" className={styles.retour}>Retour à la liste</Link>
      </div>
    );
  }

  const prix = evenement.prix === 0 ? "Gratuit" : `${evenement.prix} FCFA`;
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
        <dt>Organise par</dt>
        <dd>{evenement.profiles ? evenement.profiles.nom : "Equipe SenEvent"}</dd>
      </dl>

      <BoutonInscription evenementId={evenement.id} session={session} />
      {session && session.user.id === evenement.organisateur_id && (
        <button onClick={supprimer} className={styles.supprimer}>
          Supprimer cet evenement
        </button>
      )}
    </div>
  );
};

export default Detail;