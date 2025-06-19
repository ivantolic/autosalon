import { useNavigate } from "react-router-dom";
import '../styles/BrandPage.css';
import skodaHero from "../assets/skoda/heroskoda.jpg";
import skodaKaroq from "../assets/skoda/skoda-karoq.jpg";
import skodaScala from "../assets/skoda/skoda-scala.jpg";
import skodaSuperb from "../assets/skoda/skoda-superb.jpg";
import skodaOctavia from "../assets/skoda/skoda-octavia.jpg";
import skodaKamiq from "../assets/skoda/skoda-kamiq.jpg";
import skodaEnyaq from "../assets/skoda/skoda-enyaq.jpg";
import skodaFabia from "../assets/skoda/skoda-fabia.jpg";
import skodaKodiaq from "../assets/skoda/skoda-kodiaq.jpg";

const models = [
  { name: "KAROQ", image: skodaKaroq },
  { name: "SCALA", image: skodaScala },
  { name: "SUPERB", image: skodaSuperb },
  { name: "OCTAVIA", image: skodaOctavia },
  { name: "KAMIQ", image: skodaKamiq },
  { name: "ENYAQ", image: skodaEnyaq },
  { name: "FABIA", image: skodaFabia },
  { name: "KODIAQ", image: skodaKodiaq },
];

const SkodaPage = () => {
  const navigate = useNavigate();

  const handleModelClick = (model) => {
    navigate(`/vozila?brand=skoda&model=${model.toLowerCase()}`);
  };

  const handleAllSkoda = () => {
    navigate(`/vozila?brand=skoda`);
  };

  return (
    <div className="brand-page-container">
      <div className="brand-hero-full">
        <img src={skodaHero} alt="Škoda hero" className="brand-hero-img-full" />
        <div className="brand-hero-title-full">Škoda</div>
      </div>
      <div className="brand-models-section">
        <h2>Škoda modeli:</h2>
        <div className="brand-models-grid">
          {models.map((model, idx) => (
            <div
              className="brand-model-card"
              key={idx}
              onClick={() => handleModelClick(model.name)}
              tabIndex={0}
            >
              <img src={model.image} alt={model.name} />
              <span>{model.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="brand-all-vehicles">
        <button onClick={handleAllSkoda} className="brand-all-btn">
          Prikaži sva Škoda vozila
        </button>
      </div>
    </div>
  );
};

export default SkodaPage;
