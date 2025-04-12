//import React from "react";
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header>
      <div className="container header-content">
        <div className="logo">
          <span className="logo-icon">♪</span>
          <h1>Music<span className="highlight">Mixer</span></h1>
        </div>
        <nav>
          <ul>
          <li><Link to="/">Music Generation</Link></li>
          <li><Link to="/lyric-generation">Lyric Generation</Link></li>
          <li><Link to="/catalog">Generated Catalog</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;