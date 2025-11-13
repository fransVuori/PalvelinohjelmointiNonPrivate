// Tuodaan tyylitiedosto ja tarvittavat React-hookit
import "./App.css";
import React, { useState, useEffect } from "react";

// Tuodaan käännöstekstit, ruokalistadata ja eri näkymäkomponentit
import { translations } from "./i18n";
import Items from "./Items";
import ShowMenu from "./frames/ShowMenu";
import StartMenu from "./frames/StartMenu";

function App() {
  // Sovelluksen tilat
  const [lang, setLang] = useState("fi");            // valittu kieli
  const [showMenu, setShowMenu] = useState(false);   // näytetäänkö varsinainen menu
  const [menuItems, setMenuItems] = useState([]);    // haetut ruokalistatiedot

  // Kun komponentti latautuu ensimmäisen kerran, haetaan menu-data
  useEffect(() => {
    Items.getAll()
      .then((data) => setMenuItems(data))
      .catch((err) => console.error("Error fetching menu items:", err));
  }, []);

  // Käyttäjä valitsee lipusta kielen
  const handleFlagClick = (language) => {
    setLang(language);
    setShowMenu(true);
  };

  // Sovelluksen näkymärakenne:
  // 1. Ensin kielivalinta (StartMenu)
  // 2. Sitten varsinainen menu (ShowMenu)
  return (
    <div className="container">
      {!showMenu ? (
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
