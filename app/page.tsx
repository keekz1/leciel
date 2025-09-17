"use client";

import { useState } from "react";
import Menu from "./components/Menu";
import "./Home.css";
import Footer from './components/Footer';
import { MapPin, Phone, Clock } from "lucide-react";

export default function Home() {
  const [showLocation, setShowLocation] = useState(false);

  return (
    <main className="home-container" style={{ backgroundColor: "#0b3b51" }}>
      <header className="header">
        {/* Location icon (top-left) */}
        <button
          className="location-btn"
          onClick={() => setShowLocation(!showLocation)}
          aria-label="Show location"
          title="Show location"
        >
          <MapPin size={22} />
        </button>

        <img
          src="https://i.imgur.com/tcA55YZ.jpeg"
          alt="Le Ciel Logo"
          className="header-logo"
        />
        <p className="header-tagline">A Sunset Escape with Taste</p>
      </header>

      {/* Location popup */}
      {showLocation && (
        <div className="location-popup">
          <h3>📍 Our Location</h3>
          <p>Aramoun, Mount Lebanon</p>
          <a
            href="https://maps.app.goo.gl/Vj8HvS6m77XkNDAK8?g_st=ipc"
            target="_blank"
            rel="noopener noreferrer"
            className="map-link"
          >
            View on Google Maps
          </a>

          {/* Phone */}
          <div className="contact-info">
            <Phone size={18} /> <span>+961 76 191 019</span>
          </div>

          {/* Opening hours */}
          <div className="contact-info">
            <Clock size={18} /> <span>Open: 5 PM - 1 AM</span>
          </div>
        </div>
      )}

      <section className="menu-section">
        <Menu />
        <Footer />
      </section>
    </main>
  );
}
