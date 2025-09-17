import React from 'react';
import './footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Le Ciel lounge | Sunset View • Good Vibes</p>
      <p className="socials">
        Follow us:{" "}
       <a
  href="https://www.instagram.com/leciel.lounge"
  target="_blank"
  rel="noopener noreferrer"
>

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
            alt="Instagram"
            className="social-icon"
          />
        </a>
      </p>
       <p className="socials">
       
        <a href="/controlpanel-3b7v" target="_blank" rel="noopener noreferrer">
          <img 
            src="https://img.icons8.com/ios-glyphs/30/ffffff/admin-settings-male.png" 
            alt="Admin" 
            className="social-icon"
          />
        </a>
      </p>
    </footer>
  );
}

export default Footer;
