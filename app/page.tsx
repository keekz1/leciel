"use client";

import Menu from "./components/Menu";
import "./Home.css";
import Footer from './components/Footer';

export default function Home() {
  return (
  <main className="home-container" style={{ backgroundColor: "#0b3b51"  }}>
  <header className="header">
    <img
      src="https://i.imgur.com/tcA55YZ.jpeg"
      alt="Le Ciel Logo"
      className="header-logo"
    />
    <p className="header-tagline">A Sunset Escape with Taste</p>
  </header>

  <section className="menu-section">
    <Menu />
    <Footer/>
  </section>
  
</main>
   );
}
