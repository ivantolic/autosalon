import React from "react";
import heroAbout from "../assets/about/heroabout.jpg"; // prilagodi putanju ako treba
import "../styles/About.css";

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero-section">
        <img src={heroAbout} alt="O nama hero" className="about-hero-img" />
        <div className="about-hero-overlay">
          <h1 className="about-hero-title">O nama</h1>
        </div>
      </div>
      <div className="about-content">
        <p>
          Naš autosalon osnovan je davne 2002. godine i već 23 godine uspješno posluje u Slavonskom Brodu.
          Od skromnog početka s nekoliko vozila, danas smo postali jedan od vodećih autosalona u regiji.
        </p>
        <p>
        <p>
          Kao ovlašteni serviser i prodajni partner marki Audi, Seat i Škoda,
          nudimo našim kupcima najnovije modele vozila uz jamstvo kvalitete i sigurnosti.
          Osim novih automobila, u našoj ponudi pronaći ćete pažljivo odabrana rabljena vozila s provjerenom servisnom poviješću,
          kao i luksuzna vozila za najzahtjevnije klijente. Naša stručnost,
          bogata ponuda i individualan pristup svakom kupcu čine nas prvim izborom za sve koji traže pouzdano vozilo i vrhunsku uslugu.
        </p>
        </p>
        <p>
          Ponosimo se svojom modernom servisnom radionicom opremljenom dijagnostičkom opremom, autolimarijom i autopraonicom.
          Kroz godine smo ostvarili brojne nagrade za kvalitetu i zadovoljstvo kupaca.
        </p>
        <p>
          Naša misija je pružiti potpunu uslugu - od savjetovanja pri kupnji
          do profesionalnog održavanja i servisa vašeg vozila. Posjetite nas i uvjerite se zašto smo prvi izbor kupaca u regiji!
        </p>
      </div>
    </div>
  );
};

export default About;
