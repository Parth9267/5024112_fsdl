import React, { useState } from 'react';
import './LuxuryLanding.css';

const cars = [
  {
    id: 1,
    name: 'Predator GT',
    image: 'https://source.unsplash.com/featured/?supercar',
    zeroTo60: 2.9,
    topSpeed: 212,
    horsepower: 710,
  },
  {
    id: 2,
    name: 'NightRider X',
    image: 'https://source.unsplash.com/featured/?luxury-car',
    zeroTo60: 3.4,
    topSpeed: 198,
    horsepower: 650,
  },
  // add more cars if desired
];

const LuxuryLanding = () => {
  const [selectedId, setSelectedId] = useState(null);
  const selectCar = (id) => {
    setSelectedId(id === selectedId ? null : id);
  };

  return (
    <section className="luxury-landing">
      <nav className="top-nav">
        <div className="logo">
          CAR<span className="red-x">X</span>
        </div>
        <div className="links">
          <button className="ghost">Home</button>
          <button className="ghost">Fleet</button>
          <button className="ghost">Contact</button>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-image" />
        <div className="booking-widget glass">
          <h2>Reserve Your Ride</h2>
          <input type="text" placeholder="Pick-up location" />
          <input type="date" />
          <button className="cta">Book Now</button>
        </div>
      </div>

      <div className="specs-section">
        <h2 className="section-title">Available Supers</h2>
        <div className="cards">
          {cars.map((c) => (
            <div
              key={c.id}
              className={`specs-card ${selectedId === c.id ? 'selected' : ''}`}
              onClick={() => selectCar(c.id)}
            >
              <div className="card-img" style={{ backgroundImage: `url(${c.image})` }} />
              <h3>{c.name}</h3>
              <div className="stat">
                <span>0-60 mph</span>
                <div className="bar-wrapper">
                  <div
                    className="bar"
                    style={{ '--pct': `${(c.zeroTo60 / 5) * 100}%` }}
                  />
                </div>
              </div>
              <div className="stat">
                <span>Top Speed</span>
                <div className="bar-wrapper">
                  <div
                    className="bar"
                    style={{ '--pct': `${(c.topSpeed / 220) * 100}%` }}
                  />
                </div>
              </div>
              <div className="stat">
                <span>HP</span>
                <div className="bar-wrapper">
                  <div
                    className="bar"
                    style={{ '--pct': `${(c.horsepower / 800) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LuxuryLanding;
