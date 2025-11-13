import { useState } from "react";

const SITES = ["Jalasjärvi", "Mäntsälä", "Kärsämäki", "Ylöjärvi", "Kuopio"];

const StartScreen = ({ onContinue }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="startscreen">
      <div
        className="startscreen-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="siteTitle"
      >
        <h1 id="siteTitle">Valitse toimipaikka</h1>
        <p className="muted">
          Huom! Tämä näkymä on kosmeettinen esikatselu, eikä sillä ole tässä
          vaiheessa vielä toiminnallisuutta. Tämä asetetaan ensimmäisen kerran,
          kun sovellus ladataan toimipaikassa. Tähän näkymään ei voi palata
          sovelluksen käytön aikana.
        </p>

        <div className="site-grid">
          {SITES.map((name) => (
            <button
              key={name}
              className={`site-button ${
                selected === name ? "selected" : ""
              }`}
              onClick={() => setSelected(name)}
              type="button"
            >
              {name}
            </button>
          ))}
        </div>

        <div className="startscreen-actions">
          <button className="confirm-button" onClick={onContinue} type="button">
            Jatka
          </button>
        </div>
      </div>

      {/* vasen alakulma versiotagi */}
      <div className="dev-badge" aria-label="Dev build">
        Dev build v0.4
      </div>
    </div>
  );
};

export default StartScreen;
