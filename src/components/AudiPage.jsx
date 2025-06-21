import { useNavigate } from "react-router-dom";
import '../styles/BrandPage.css';
import audiHero from "../assets/audi/heroaudi.jpg";
import audiA1 from "../assets/audi/audi-a1.jpg";
import audiA3 from "../assets/audi/audi-a3.jpg";
import audiA4 from "../assets/audi/audi-a4.jpg";
import audiA5 from "../assets/audi/audi-a5.jpg";
import audiA6 from "../assets/audi/audi-a6.jpg";
import audiA7 from "../assets/audi/audi-a7.jpg";
import audiA8 from "../assets/audi/audi-a8.jpg";
import audiQ2 from "../assets/audi/audi-q2.jpg";
import audiQ3 from "../assets/audi/audi-q3.jpg";
import audiQ5 from "../assets/audi/audi-q5.jpg";
import audiQ7 from "../assets/audi/audi-q7.jpg";
import audiQ8 from "../assets/audi/audi-q8.jpg";

const models = [
  { name: "A1", image: audiA1 },
  { name: "A3", image: audiA3 },
  { name: "A4", image: audiA4 },
  { name: "A5", image: audiA5 },
  { name: "A6", image: audiA6 },
  { name: "A7", image: audiA7 },
  { name: "A8", image: audiA8 },
  { name: "Q2", image: audiQ2 },
  { name: "Q3", image: audiQ3 },
  { name: "Q5", image: audiQ5 },
  { name: "Q7", image: audiQ7 },
  { name: "Q8", image: audiQ8 },
];

const AudiPage = () => {
  const navigate = useNavigate();

  const handleModelClick = (model) => {
    navigate(`/vozila?brand=audi&model=${model.toLowerCase()}`);
  };

  const handleAllAudi = () => {
    navigate(`/vozila?brand=audi`);
  };

  return (
    <div className="brand-page-container">
      <div className="brand-hero-full">
        <img src={audiHero} alt="Audi hero" className="brand-hero-img-full" />
        <div className="brand-hero-title-full audi-title">Audi</div>
      </div>
      <div className="brand-models-section">
        <h2 className="audi-title">Audi modeli:</h2>
        <div className="brand-models-grid">
          {models.map((model, idx) => (
            <div
              className="brand-model-card"
              key={idx}
              onClick={() => handleModelClick(model.name)}
              tabIndex={0}
            >
              <img src={model.image} alt={model.name} />
              <span className="audi-model">{model.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="brand-all-vehicles">
        <button onClick={handleAllAudi} className="brand-all-btn audi-title">
          Prikaži sva Audi vozila
        </button>
      </div>
    </div>
  );
};

export default AudiPage;
