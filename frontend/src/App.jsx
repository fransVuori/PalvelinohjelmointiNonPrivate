// Tuodaan tyylitiedosto ja tarvittavat React-hookit
import "./App.css";
import React, { useState, useEffect } from "react";

// Tuodaan käännöstekstit, ruokalistadata ja eri näkymäkomponentit
import { translations } from "./i18n";
import Items from "./Items";
import ShowMenu from "./frames/ShowMenu";
import StartScreen from "./frames/StartScreen";
import StartMenu from "./frames/StartMenu";

function App() {
  // Sovelluksen tilat
  const [lang, setLang] = useState("fi");            // valittu kieli
  const [showMenu, setShowMenu] = useState(false);   // näytetäänkö varsinainen menu
  const [menuItems, setMenuItems] = useState([]);    // haetut ruokalistatiedot
  const [showStartScreen, setShowStartScreen] = useState(true); // käynnistysnäkymä

  // Kun komponentti latautuu ensimmäisen kerran, haetaan menu-data
  useEffect(() => {
    Items.getAll()
      .then((data) => setMenuItems(data))
      .catch((err) => console.error("Error fetching menu items:", err));
  }, []);

  // Käyttäjä valitsee lipusta kielen
  const handleFlagClick = (language) => {
    setLang(language);     // päivitetään valittu kieli
    setShowMenu(true);     // siirrytään menu-näkymään
  };

  // Sovelluksen näkymärakenne:
  // 1. Näytetään ensin käynnistysruutu (StartScreen)
  // 2. Kun käyttäjä jatkaa, näytetään kielivalinta (StartMenu)
  // 3. Kun kieli on valittu, näytetään varsinainen menu (ShowMenu)
  return (
    <div className="container">
      {showStartScreen ? (
        <StartScreen onContinue={() => setShowStartScreen(false)} />
      ) : !showMenu ? (
        <StartMenu handleFlagClick={handleFlagClick} />
      ) : (
        <ShowMenu
          lang={lang}
          setShowMenu={setShowMenu}
          menuItems={menuItems}
          translations={translations}
        />
      )}
    </div>
  );
}

export default App;
