import { useState } from "react";
import EvenementCarte from "./components/EvenementCarte";
import styles from "./App.module.css";

const App = () => {
    const [evenements, setEvenements] = useState([]);
    const [chargement, setChargement] = useState(false);

    const charger = async () => {
        setChargement(true);
        try {
            const reponse = await fetch("/evenements.json");
            const data = await reponse.json();
            setEvenements(data);
        } catch (error) {
            console.error("Erreur :", error);
        }
        setChargement(false);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.titre}>SenEvent --- Evenements a Dakar</h1>
            <button 
                className={styles.bouton}
                onClick={charger}
                disabled={chargement}
            >
                {chargement ? "Chargement..." : "Charger les evenements"}
            </button>
            {evenements.map(ev => (
                <EvenementCarte key={ev.id} ev={ev} afficherDetails={true} />
            ))}
        </div>
    );
};

export default App;