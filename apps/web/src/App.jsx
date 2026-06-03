import { useState } from "react";
import EvenementCarte from "./components/EvenementCarte";

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
    } finally {
      setChargement(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "2rem auto",
        fontFamily: "sans-serif"
      }}
    >
      <h1>SenEvent - Evenements a Dakar</h1>

      <button
        onClick={charger}
        disabled={chargement}
        style={{
          padding: "10px 20px",
          cursor: "pointer"
        }}
      >
        {chargement ? "Chargement..." : "Charger les evenements"}
      </button>

      { evenements.map(ev=>(
        <EvenementCarte key ={ ev . id } ev ={ ev } afficherDetails ={false} />))
        }
    </div>
  );
};

export default App;