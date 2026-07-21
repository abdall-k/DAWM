import { NavLink } from "react-router-dom";
import { seDeconnecter } from "@senevent/shared";
import styles from "./NavBar.module.css";

const NavBar = ({ session }) => {
  const lienActif = ({ isActive }) =>
    isActive ? `${styles.lien} ${styles.lienActif}` : styles.lien;

  const deconnexion = async () => {
    await seDeconnecter();
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>SenEvent</div>
      <div className={styles.liens}>
        <NavLink to="/" end className={lienActif}>Accueil</NavLink>
        {session && (
          <NavLink to="/nouveau" className={lienActif}>Nouvel evenement</NavLink>
        )}
        {session ? (
          <>
            <span className={styles.email}>{session.user.email}</span>
            <button onClick={deconnexion} className={styles.deconnexion}>
              Se deconnecter
            </button>
          </>
        ) : (
          <NavLink to="/auth" className={lienActif}>Se connecter</NavLink>
        )}
      </div>
    </nav>
  );
};

export default NavBar;