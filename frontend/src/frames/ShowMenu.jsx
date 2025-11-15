// React-komponentti, joka näyttää varsinaisen ruokalistanäkymän
import React, { useState, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import TypewriterText from "../TypewriterText";
import Items from "../Items";


// Liput ja kuvat eri käyttöliittymäelementeille
import finFlag from "../assets/img/fi.png";
import sweFlag from "../assets/img/se.png";
import ukFlag from "../assets/img/gb.png";
import filterIMG from "../assets/img/filter_plc.png";

// Kuvapohjat dieettikategorioille
import glutenImg from "../assets/img/dietCaregories/plc.png";
import milkImg from "../assets/img/dietCaregories/plc.png";
import lactoseImg from "../assets/img/dietCaregories/plc.png";
import nutsImg from "../assets/img/dietCaregories/plc.png";
import meatImg from "../assets/img/dietCaregories/plc.png";
import animalImg from "../assets/img/dietCaregories/plc.png";
import fishImg from "../assets/img/dietCaregories/plc.png";
import seafoodImg from "../assets/img/dietCaregories/plc.png";
import soyImg from "../assets/img/dietCaregories/plc.png";
import eggImg from "../assets/img/dietCaregories/plc.png";

// Apufunktio hakee tuotteen tai kategorian tekstin valitulla kielellä
const getLocalizedText = (item, lang, key) => {
  const langKey = key + lang.toUpperCase();
  // Palauttaa esim. item.nameFI, item.descriptionSV
  return item[langKey] || item[key] || "";
};

// ---------------- OIKEA PANEELI (tuotetiedot / suodatininfo / oletusviesti) ----------------
const RightPanelManager = ({
  lang,
  translations,
  selectedProduct,
  filterActive,
  tempCategoryState,
  activeCategory,
}) => {
  // Jos tuote on valittu, näytetään sen tiedot oikealla
  if (selectedProduct) {
    const name = getLocalizedText(selectedProduct, lang, "name");
    const description = getLocalizedText(selectedProduct, lang, "description");

    return (
      <div className="menu-right">
        <h3>
          <TypewriterText text={name}/>
        </h3>
        <p>
          <strong>
            <TypewriterText text={selectedProduct.details}/>
          </strong>
          <br />
          <span style={{ fontSize: "1.2em", color: "#aaa" }}>
            <TypewriterText text={selectedProduct.price}/>
          </span>
        </p>

        <p style={{ marginTop: "2vh", color: "#ccc" }}>
          <TypewriterText text={description}/>
        </p>
      </div>
    );
  }

  // Jos suodatin on aktiivinen tai valittuja kategorioita on,
  // näytetään suodatustiedot ja aktiiviset suodattimet
  if (filterActive || Object.values(activeCategory).some(Boolean)) {
    const activeFilters = Object.keys(tempCategoryState).filter(
      (key) => tempCategoryState[key]
    );

    return (
      <div className="menu-right">
        <h3>
          <TypewriterText text={translations[lang].filterHeader}/>
        </h3>
        {activeFilters.length > 0 ? (
          <>
            <p>{translations[lang].activeFilters}</p>
            <ul className="active-filter-list">
              {activeFilters.map((key) => (
                <li key={key}>
                  <TypewriterText text={translations[lang][key + "Alt"]} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>{translations[lang].noActiveFilters}</p>
        )}
      </div>
    );
  }

  // Oletusnäkymä kun ei ole valittua tuotetta tai aktiivista suodatinta
  return (
    <div className="menu-right">
      <h3>{translations[lang].infoHeader}</h3>
      <p>{translations[lang].infoText}</p>
    </div>
  );
};

// ---------------- PÄÄKOMPONENTTI ----------------
const ShowMenu = ({ lang, setShowMenu, menuItems, translations }) => {
  // Tilat käyttöliittymän eri tiloille ja toiminnoille
  const [openCategory, setOpenCategory] = useState(null); // mikä kategoria on auki
  const [selectedProduct, setSelectedProduct] = useState(null); // valittu tuote
  const [filterActive, setFilterActive] = useState(false); // suodatintila
  const [fadeText, setFadeText] = useState(false); // animointitila
  const [activeCategory, setActiveCategory] = useState({}); // tallennetut suodattimet
  const [hasChanges, setHasChanges] = useState(false); // onko suodattimia muutettu
  const [tempCategoryState, setTempCategoryState] = useState({}); // väliaikainen suodatinmuutos
  const categoryRefs = useRef({}); // viittaukset kategorioihin scrollausta varten
  const [fadeOut, setFadeOut] = useState(false); // fade-animaatio
  const [showCancelConfirm, setShowCancelConfirm] = useState(false); // peruuta-modal
  const [showResetConfirm, setShowResetConfirm] = useState(false); // nollaus-modal
  const [filteredProducts, setFilteredProducts] = useState([]); // suodatetut tuotteet

  // Modalien hallintafunktiot
  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };
  const confirmCancel = () => {
    setShowCancelConfirm(false);
    cancelChanges();
  };
  const cancelCancel = () => {
    setShowCancelConfirm(false);
  };

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };
  const confirmReset = () => {
    setShowResetConfirm(false);
    resetAllCategories();
  };
  const cancelReset = () => {
    setShowResetConfirm(false);
  };

  // Avaa tai sulkee kategorian (ruokalistan osion)
  const toggleCategory = (categoryId) => {
    setOpenCategory((prev) => (prev === categoryId ? null : categoryId));
    if (categoryRefs.current[categoryId]) {
      categoryRefs.current[categoryId].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Suodatin-nappulan käsittely (avaa tai sulkee suodatinnäkymän)
  const toggleFilter = () => {
    setSelectedProduct(null);

    if (!filterActive) {
      // avataan suodatin
      setTempCategoryState(activeCategory);
      setFadeOut(true);
      setTimeout(() => {
        setFilterActive(true);
        setFadeOut(false);
        setFadeText(true);
      }, 300);
    } else {
      // suljetaan suodatin
      setFadeOut(true);
      setTimeout(() => {
        setFadeText(false);
        setFilterActive(false);
        setFadeOut(false);
        setHasChanges(false);
      }, 300);
    }
  };

  const saveChanges = async () => {
    setActiveCategory(tempCategoryState);
    setHasChanges(false);

    try {
      const products = await Items.getFilteredProducts(lang, tempCategoryState);
      setFilteredProducts(products);
    } catch (err) {
      console.error("Filter fetch failed:", err);
    }

    toggleFilter();
  };



  // Peru suodatinmuutokset ja palaa alkuun
  const cancelChanges = () => {
    setTempCategoryState(activeCategory);
    setHasChanges(false);
    setFilteredProducts([]); 
    toggleFilter();
  };


  // Klikattaessa dieettikategoriaa (pallo)
  const handleCategoryClick = (categoryId) => {
    setTempCategoryState((prevState) => {
      const newState = { ...prevState, [categoryId]: !prevState[categoryId] };
      const changed = Object.keys(newState).some((key) => newState[key] !== activeCategory[key]);
      setHasChanges(changed);
      return newState;
    });
  };

  // Suodatettu lista tuotteista aktiivisten kategorioiden perusteella
  // (filteredProducts is managed via state and updated by setFilteredProducts)
  // Dieettikategorioiden data
  const categoryData = [
    { id: "gluten", labelKey: "gluten", altLabelKey: "glutenAlt", img: glutenImg },
    { id: "milk", labelKey: "milk", altLabelKey: "milkAlt", img: milkImg },
    { id: "lactose", labelKey: "lactose", altLabelKey: "lactoseAlt", img: lactoseImg },
    { id: "nuts", labelKey: "nuts", altLabelKey: "nutsAlt", img: nutsImg },
    { id: "meat", labelKey: "meat", altLabelKey: "meatAlt", img: meatImg },
    { id: "animal", labelKey: "animal", altLabelKey: "animalAlt", img: animalImg },
    { id: "fish", labelKey: "fish", altLabelKey: "fishAlt", img: fishImg },
    { id: "seafood", labelKey: "seafood", altLabelKey: "seafoodAlt", img: seafoodImg },
    { id: "soy", labelKey: "soy", altLabelKey: "soyAlt", img: soyImg },
    { id: "egg", labelKey: "egg", altLabelKey: "eggAlt", img: eggImg },
  ];

  // Nollaa kaikki suodattimet
  const resetAllCategories = () => {
    const resetState = Object.keys(tempCategoryState).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    setTempCategoryState(resetState);
  };

  // Tarkistaa onko suodattimissa muutoksia aktiivisiin verrattuna
  const hasCategoryChanges = () => {
    const allKeys = Array.from(
      new Set([...Object.keys(activeCategory), ...Object.keys(tempCategoryState)])
    );
    return allKeys.some(key => !!activeCategory[key] !== !!tempCategoryState[key]);
  };

  return (
    <div className={`menu-view ${showCancelConfirm ? "modal-open" : ""}`}>
      {/* --- VASEN PUOLI --- */}
      <div className="menu-left">
        <div className={`menu-header ${filterActive ? "expanded" : ""}`}>
          {/* Lipun klikkaus palaa kielivalintaan */}
          <div className="menu-header-left">
            <div className="selected-flag-wrapper" onClick={() => setShowMenu(false)}>
              <img
                src={lang === "fi" ? finFlag : lang === "sv" ? sweFlag : ukFlag}
                alt="Selected flag"
                className="selected-flag"
              />
            </div>
          </div>

          {/* Suodatinnapit */}
          <div className="filter-controls">
            {hasCategoryChanges() && (
              <button className="cancel-button" onClick={handleCancelClick}>
                {translations[lang].cancel}
              </button>
            )}

            {filterActive && Object.keys(tempCategoryState).length > 0 && (
              <button className="reset-button" onClick={handleResetClick}>
                {translations[lang].reset}
              </button>
            )}

            <button
              className={`filter-button 
                ${hasCategoryChanges() ? "save-active" : ""} 
                ${Object.values(tempCategoryState).some(Boolean) ? "glow-on-hover" : ""}`}
              onClick={hasCategoryChanges() ? saveChanges : toggleFilter}
            >
              <img src={filterIMG} alt="Filter icon" className="filter-icon" />
              {hasCategoryChanges()
                ? translations[lang].save
                : filterActive
                ? translations[lang].exit
                : translations[lang].filter}
            </button>
          </div>
        </div>

        {/* --- Suodatettu lista näkyy, jos suodatin on päällä --- */}
        {!fadeText && Object.values(activeCategory).some(Boolean) && (
          <ul className={`menu-list ${fadeOut ? 'hidden-fade' : 'visible-fade'}`}>
            {filteredProducts.length === 0 ? (
              <h2>{translations[lang].noResults}</h2>
            ) : (
              filteredProducts.map((product) => (
                <li
                  key={product.id}
                  className="product-box"
                  onClick={() => setSelectedProduct(product)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="product-info">
                    <span className="product-name">{getLocalizedText(product, lang, "name")}</span>
                    <span className="product-details">{product.details}</span>
                    <span className="product-price">{product.price}</span>
                  </div>
                  <p className="product-description">{getLocalizedText(product, lang, "description")}</p>
                </li>
              ))
            )}
          </ul>
        )}

        {/* --- Tavallinen lista jos suodatin ei ole käytössä --- */}
        {!fadeText && !Object.values(activeCategory).some(Boolean) && (
          <ul className={`menu-list ${fadeOut ? 'hidden-fade' : 'visible-fade'}`}>
            {menuItems.length === 0 ? (
              <h2>{translations[lang].loadingError}</h2>
            ) : (
              menuItems.map((category) => (
                <li key={category.id}>
                  <div
                    className={`category-box ${openCategory === category.id ? "active" : ""}`}
                    onClick={() => toggleCategory(category.id)}
                  >
                    <strong>{getLocalizedText(category, lang, "name")}</strong>
                    <span className="toggle-icon">
                      {openCategory === category.id ? <ChevronUp /> : <ChevronDown />}
                    </span>
                  </div>

                  <div ref={(el) => { categoryRefs.current[category.id] = el; }}>
                    {openCategory === category.id && category.items?.length > 0 && (
                      <ul>
                        {category.items.map((product) => (
                          <li
                            key={product.id}
                            className="product-box"
                            onClick={() => setSelectedProduct(product)}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="product-info">
                              <span className="product-name">
                                {getLocalizedText(product, lang, "name")}
                              </span>
                              <span className="product-details">{product.details}</span>
                              <span className="product-price">{product.price}</span>
                            </div>
                            <p className="product-description">
                              {getLocalizedText(product, lang, "description")}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        )}

        {/* --- Dieettikategorioiden "pallot" --- */}
        {fadeText && (
          <div className={`dietCategories ${fadeOut ? 'hidden-fade' : 'visible-fade'}`}>
            {categoryData.map((category, index) => (
              <div
                key={index}
                className={`category ${tempCategoryState[category.id] ? "active" : ""}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <img
                  src={category.img}
                  alt={translations[lang][category.labelKey]}
                />
                <span>
                  {tempCategoryState[category.id]
                    ? translations[lang][category.altLabelKey]
                    : translations[lang][category.labelKey]}
                </span>
              </div>
            ))}
            {/* Ainesosa-mustalista placeholder kehitystä varten */}
            <div className="ingredientBlacklist">
              <h3>Ainesosa-mustalista</h3>
              <p className="dev-note">
                (DEV NOTE) Toiminnon toteuttaminen vaatii kattavampaa tietokantaa, joka ei ole kurssikohtaista tehdä.
              </p>
              <div className="blacklist-input-row">
                <input type="text" placeholder="Kirjoita ainesosa..." className="blacklist-input" />
                <button className="blacklist-add">Lisää</button>
              </div>
              <div className="blacklist-table">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Ainesosa</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Esimerkki: vehnä</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Esimerkki: kananmuna</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- OIKEA PUOLI (tuotetiedot / suodattimet / infoteksti) --- */}
      <RightPanelManager
        lang={lang}
        translations={translations}
        selectedProduct={selectedProduct}
        filterActive={filterActive}
        tempCategoryState={tempCategoryState}
        activeCategory={activeCategory}
      />

      {/* Peruuta-modal */}
      {showCancelConfirm && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancelTitle"
            aria-describedby="cancelDesc"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="cancelTitle">{translations[lang].cancelConfirmTitle}</h3>
            <p id="cancelDesc">{translations[lang].cancelConfirmText}</p>

            <div className="confirm-actions">
              <button className="confirm-button danger" onClick={confirmCancel}>
                {translations[lang].confirmYes}
              </button>
              <button className="confirm-button" onClick={cancelCancel}>
                {translations[lang].confirmNo}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nollaus-modal */}
      {showResetConfirm && (
        <div className="modal-backdrop" role="presentation" onClick={(e)=>e.stopPropagation()}>
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resetTitle"
            aria-describedby="resetDesc"
            onClick={(e)=>e.stopPropagation()}
          >
            <h3 id="resetTitle">{translations[lang].resetConfirmTitle}</h3>
            <p id="resetDesc">{translations[lang].resetConfirmText}</p>

            <div className="confirm-actions">
              <button className="confirm-button danger" onClick={confirmReset}>
                {translations[lang].confirmYes}
              </button>
              <button className="confirm-button" onClick={cancelReset}>
                {translations[lang].confirmNo}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowMenu;
