import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";

import heroAudiQ5 from "../assets/home/heronewq5.jpg";
import heroSkodaKodiaq from "../assets/home/heronewkodiaq.jpg";
import heroSeatArona from "../assets/home/heronewarona.jpg";
import servisImg from "../assets/home/servis.jpg";
import luksuznaImg from "../assets/home/luksuzna.jpeg";
import audiLogo from "../assets/home/audiicon.png";
import skodaLogo from "../assets/home/skodaicon.png";
import seatLogo from "../assets/home/seaticon.png";

const carouselData = [
  {
    image: heroAudiQ5,
    title: "Novi Audi Q5",
    subtitle: "Inovacija, snaga i luksuz u vrhunskom SUV-u.",
    cta: "Pogledaj našu Audi ponudu",
    link: "/vozila?brand=Audi",
  },
  {
    image: heroSkodaKodiaq,
    title: "Nova Škoda Kodiaq",
    subtitle: "Tehnologija, prostor i elegancija za cijelu obitelj.",
    cta: "Pogledaj našu Škoda ponudu",
    link: "/vozila?brand=Škoda",
  },
  {
    image: heroSeatArona,
    title: "Nova Seat Arona",
    subtitle: "Crossover s karakterom za gradsku avanturu.",
    cta: "Pogledaj našu Seat ponudu",
    link: "/vozila?brand=Seat",
  },
];

const Home = () => {
  const [current, setCurrent] = useState(0); // "Slide index"
  const navigate = useNavigate();

  // Carousel funkcije
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? carouselData.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev === carouselData.length - 1 ? 0 : prev + 1));

  return (
    <>
      <div className="carousel-outer">
        <div className="home-carousel">
          <img src={carouselData[current].image} alt="" className="carousel-img" />
          <div className="carousel-overlay" />
          <div className="carousel-content">
            <h1 className="carousel-title">{carouselData[current].title}</h1>
            <div className="carousel-subtitle">{carouselData[current].subtitle}</div>
            <button
              className="carousel-cta"
              onClick={() => navigate(carouselData[current].link)}
            >
              {carouselData[current].cta}
            </button>
          </div>
          <button className="carousel-arrow left" onClick={prevSlide}>&#10094;</button>
          <button className="carousel-arrow right" onClick={nextSlide}>&#10095;</button>
          <div className="carousel-dots">
            {carouselData.map((_, idx) => (
              <span
                key={idx}
                className={`carousel-dot${current === idx ? " active" : ""}`}
                onClick={() => setCurrent(idx)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="home-feature-banners">
        <div className="feature-banner" style={{ backgroundImage: `url(${servisImg})` }}>
          <div className="feature-banner-overlay" />
          <div className="feature-banner-content">
            <h2>Ovlašteni servis</h2>
            <p>
              Jednostavno i brzo dogovorite svoj termin servisa online.<br />
              Naši ovlašteni serviseri brinu za vaš Audi, Seat ili Škodu.
            </p>
            <Link to="/servis/novi" className="feature-banner-btn">Rezerviraj servis</Link>
          </div>
        </div>

        <div className="feature-banner" style={{ backgroundImage: `url(${luksuznaImg})` }}>
          <div className="feature-banner-overlay" />
          <div className="feature-banner-content">
            <h2>Luksuzna vozila</h2>
            <p>
              Premium, luksuzna i sportska vozila iz naše ekskluzivne ponude dostupna odmah.<br />
              Vrhunski izbor i sigurnost kupovine!
            </p>
            <Link to="/vozila?category=luxury" className="feature-banner-btn">Pogledaj luksuznu ponudu</Link>
          </div>
        </div>

        <div className="feature-banner ovlasteni-banner">
          <div className="feature-banner-overlay light" />
          <div className="feature-banner-content">
            <h2>Ovlašteni prodavač i serviser</h2>
            <p>
              BRMBRM je ovlašteni prodavač i serviser za <b>Audi</b>, <b>Seat</b> i <b>Škoda</b> vozila.<br />
              Povjerite svoje vozilo stručnjacima!
            </p>
            <div className="feature-brands">
              <img src={audiLogo} alt="Audi" />
              <img src={seatLogo} alt="Seat" />
              <img src={skodaLogo} alt="Škoda" />
            </div>
          </div>
        </div>
      </div>

      <div className="home-why-block">
        <h2>Zašto BRMBRM?</h2>
        <p>
          Već 23 godine vaša najbolja destinacija za kupnju i servis vozila.<br />
          Iskustvo, kvaliteta i zadovoljni kupci. Ovlašteni prodavač i serviser za Audi, Seat i Škoda. U ponudi i rabljena te luksuzna vozila.
        </p>
      </div>

      <div className="home-favorites-banner">
        <span className="favorite-star">★</span>
        <span>
          Sviđa vam se neko vozilo? Dodajte ga u favorite klikom na <b>gumb za favorite</b> i pratite omiljene modele na jednom mjestu!
        </span>
      </div>

      <div className="home-contact-block">
        <div>
          <div className="contact-title">Informacije</div>
          <div>info@brmbrm.hr</div>
          <div>+385 91 555 4444</div>
          <div>Slavonija 2/2, Slavonski Brod</div>
        </div>
      </div>
    </>
  );
};

export default Home;
