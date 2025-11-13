// Tuodaan tarvittavat kuvat logosta ja lippuikoneista
import JP_logo from "../assets/img/JP_logo.png";
import finFlag from "../assets/img/fi.png";
import sweFlag from "../assets/img/se.png";
import ukFlag from "../assets/img/gb.png";

// StartMenu-komponentti vastaanottaa propsin handleFlagClick,
// jota käytetään, kun käyttäjä valitsee kielen
const StartMenu = ({ handleFlagClick }) => {
  return (
    <>
      {/* Juustoportin logo yläosassa */}
      <img className="JP_img" src={JP_logo} alt="JUUSTOPORTTI" />

      {/* Otsikko ruokalistalle */}
      <h2 className="subtitle">MENU - À la carte</h2>

      {/* Kielivalintanapit lippukuvakkeilla */}
      <div className="flags">
        {/* Suomi */}
        <button onClick={() => handleFlagClick("fi")}>
          <img src={finFlag} alt="Finnish flag" />
        </button>

        {/* Ruotsi */}
        <button onClick={() => handleFlagClick("sv")}>
          <img src={sweFlag} alt="Swedish flag" />
        </button>

        {/* Englanti */}
        <button onClick={() => handleFlagClick("en")}>
          <img src={ukFlag} alt="UK flag" />
        </button>
      </div>
    </>
  );
};

// Viedään komponentti käyttöön muihin tiedostoihin
export default StartMenu;
