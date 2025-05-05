import { HashLink as Link } from 'react-router-hash-link';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h4>MusicMixer</h4>
            <ul>
              <li><Link smooth to="/about#about-us">About Us</Link></li>
              <li><Link smooth to="/about#our-team">Our Team</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Features</h4>
            <ul>
              <li><Link smooth to="/about#music-gen">Music Generation</Link></li>
              <li><Link smooth to="/about#lyric-gen">Lyric Generation</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Support</h4>
            <ul>
              <li><Link smooth to="/about#faq">FAQs</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 MusicMixer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;