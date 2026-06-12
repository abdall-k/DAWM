// import { useState } from "react";
// import EvenementCarte from "./components/EvenementCarte";
// import SearchBar from "./components/SearchBar";
// import styles from "./App.module.css";

// const App = () => {
//     const [evenements, setEvenements] = useState([]);
//     const [chargement, setChargement] = useState(false);
//     const [recherche, setRecherche] = useState("");

//     const charger = async () => {
//         setChargement(true);
//         try {
//             const reponse = await fetch("/evenements.json");
//             const data = await reponse.json();
//             setEvenements(data);
//         } catch (error) {
//             console.error("Erreur :", error);
//         }
//         setChargement(false);
//     };

//     const evenementsFiltres = evenements.filter(ev =>
//         ev.titre.toLowerCase().includes(recherche.toLowerCase())
//     );

//     return (
//         <div className={styles.container}>
//             <h1 className={styles.titre}>SenEvent --- Evenements a Dakar</h1>
//             <button 
//                 className={styles.bouton}
//                 onClick={charger}
//                 disabled={chargement}
//             >
//                 {chargement ? "Chargement..." : "Charger les evenements"}
//             </button>

//             <SearchBar recherche={recherche} onRecherche={setRecherche} />

//             <p className={styles.compteur}>
//                 {evenementsFiltres.length} evenement(s) trouve(s)
//             </p>

//             {evenementsFiltres.map(ev => (
//                 <EvenementCarte key={ev.id} ev={ev} afficherDetails={true} />
//             ))}
//         </div>
//     );
// };

// export default App;


















import { useState, useEffect } from "react";
import EvenementCarte from "./components/EvenementCarte";
import SearchBar from "./components/SearchBar";
import styles from "./App.module.css";

const App = () => {
  const [evenements, setEvenements] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState("");

  useEffect(() => {
    const charger = async () => {
      try {
        const reponse = await fetch("/evenements.json");
        const data = await reponse.json();
        setEvenements(data);
      } catch (error) {
        console.error("Erreur :", error);
      }
      setChargement(false);
    };
    charger();
  }, []);

  const evenementsFiltres = evenements.filter(ev =>
    ev.titre.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.titre}>SenEvent --- Evenements a Dakar</h1>
      <SearchBar recherche={recherche} onRecherche={setRecherche} />
      <p className={styles.compteur}>
        {evenementsFiltres.length} evenement(s) trouve(s)
      </p>
      {evenementsFiltres.map(ev => (
        <EvenementCarte key={ev.id} ev={ev} afficherDetails={true} />
      ))}    
    </div>
  );
};
export default App;





















// import { useState } from "react";
// import EvenementCarte from "./components/EvenementCarte";
// import SearchBar from "./components/SearchBar";
// import styles from "./App.module.css";

// const App = () => {
//   const [evenements, setEvenements] = useState([]);
//   const [chargement, setChargement] = useState(false);
//   const [recherche, setRecherche] = useState("");

//   const charger = async () => {
//     setChargement(true);
//     try {
//       const reponse = await fetch("/evenements.json");
//       const data = await reponse.json();
//       setEvenements(data);
//     } catch (error) {
//       console.error("Erreur :", error);
//     }
//     setChargement(false);
//   };

//   // Filtrage en temps réel (insensible à la casse)
//   const evenementsFiltres = evenements.filter((ev) =>
//     ev.titre.toLowerCase().includes(recherche.toLowerCase())
//   );

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.titre}>SenEvent --- Evenements a Dakar</h1>
      
//       <button 
//         className={styles.bouton} 
//         onClick={charger} 
//         disabled={chargement}
//       >
//         {chargement ? "Chargement..." : "Charger les evenements"}
//       </button>

//       <SearchBar recherche={recherche} onRecherche={setRecherche} />

//       <p className={styles.compteur}>
//         {evenementsFiltres.length} evenement(s) trouve(s)
//       </p>

//       {evenementsFiltres.map((ev) => (
//         <EvenementCarte key={ev.id} ev={ev} afficherDetails={true} />
//       ))}
//     </div>
//   );
// };

// export default App;
