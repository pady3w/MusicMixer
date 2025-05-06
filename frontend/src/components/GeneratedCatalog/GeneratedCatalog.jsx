import React, { useEffect, useState } from 'react';
import axios from 'axios';

// ✅ This path must match your actual image path and name
import catalog1 from '../../Images/catalog1.png';

const GeneratedCatalog = () => {
  const [songData, setSongData] = useState([]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/catalog');
        setSongData(res.data);
      } catch (err) {
        console.error('Failed to load catalog:', err);
      }
    };

    fetchCatalog();
  }, []);

  return (
    <div className="catalog-gallery">
      <h2>Generated Music Catalog</h2>
      <p className="catalog-description">
        Discover the unique and inspired soundscapes created just for you.
      </p>
      <div className="catalog-popular-mixes">
        {songData.map((song, index) => (
          <div key={song.id || index} className="catalog-mix-card">
            <div className="catalog-mix-img">
              <img
                src={catalog1}
                alt={song.title || 'Generated song'}
              />
              <a
                href={song.url}
                target="_blank"
                rel="noopener noreferrer"
                className="catalog-play-icon"
              >
                ▶️
              </a>
            </div>
            <div className="catalog-mix-details">
              <h4 className="catalog-mix-title">{song.title}</h4>
              <div className="catalog-mix-creator">{song.creator}</div>
              <div className="catalog-mix-date">
                Created on{' '}
                {new Date(song.date).toLocaleString('en-US', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}
              </div>
              <div className="catalog-mix-tags">
                {song.tags.map((tag, i) => (
                  <span key={i} className="catalog-mix-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneratedCatalog;
