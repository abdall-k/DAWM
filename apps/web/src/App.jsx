import { useState } from "react";

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

      {evenements.map((ev) => (
        <div
          key={ev.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            marginTop: "1rem"
          }}
        >
          <h3>{ev.titre}</h3>

          <p>
            <strong>Catégorie :</strong> {ev.categorie}
          </p>

          <p>
            <strong>Lieu :</strong> {ev.lieu_nom}
          </p>

          <p>
            <strong>Prix :</strong>{" "}
            {ev.prix === 0 ? "Gratuit" : `${ev.prix} FCFA`}
          </p>
        </div>
      ))}
    </div>
  );
};

export default App;