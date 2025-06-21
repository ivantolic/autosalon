import { useNavigate } from "react-router-dom";
import '../styles/BrandPage.css';
import seatHero from "../assets/seat/heroseat.jpg";
import seatIbiza from "../assets/seat/seat-ibiza.jpg";
import seatLeon from "../assets/seat/seat-leon.jpg";
import seatArona from "../assets/seat/seat-arona.jpg";
import seatAteca from "../assets/seat/seat-ateca.jpg";

const models = [
  { name: "Ibiza", image: seatIbiza },
  { name: "Leon", image: seatLeon },
  { name: "Arona", image: seatArona },
  { name: "Ateca", image: seatAteca },
];

const SeatPage = () => {
  const navigate = useNavigate();

  const handleModelClick = (model) => {
    navigate(`/vozila?brand=seat&model=${model.toLowerCase()}`);
  };

  const handleAllSeat = () => {
    navigate(`/vozila?brand=seat`);
  };

  return (
    <div>
      <div className="brand-hero-full">
        <img src={seatHero} alt="Seat hero" className="brand-hero-img-full" />
        <div className="brand-hero-title-full seat-title">SEAT</div>
      </div>
      <div className="brand-page-container">
        <div className="brand-models-section">
          <h2 className="seat-title">SEAT modeli:</h2>
          <div className="brand-models-grid">
            {models.map((model, idx) => (
              <div
                className="brand-model-card"
                key={idx}
                onClick={() => handleModelClick(model.name)}
                tabIndex={0}
              >
                <img src={model.image} alt={model.name} />
                <span className="seat-model">{model.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="brand-all-vehicles">
          <button onClick={handleAllSeat} className="brand-all-btn seat-title">
            Prikaži sva SEAT vozila
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatPage;
