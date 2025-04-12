import React from 'react';
import SearchBar from '../common/SearchBar';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="container">
        <h2>Mix, Match, and Create Amazing Music</h2>
        <p>Combine elements from different songs to create your own unique musical masterpieces.</p>
        <SearchBar placeholder="Search for songs, beats, or melodies..." />
      </div>
    </section>
  );
};

export default HeroSection;