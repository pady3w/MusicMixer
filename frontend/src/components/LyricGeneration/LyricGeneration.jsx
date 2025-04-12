import React from "react";
import ChatArea from "../home/ChatArea";
import "../../styles/ChatArea.css";

function LyricGeneration() {
  return (
    <>       
      <section className="hero-lyric">
        <div className="container">
          <h2>Lyric Generation Studio</h2>
          <p>Generate unique lyrics by simply describing your theme or concept, and our AI will craft original lyrics just for you.</p>
          
          {/* Chat interface for lyric generation */}
          <ChatArea />
        </div>
      </section>
      
      {/* Gallery section - Showcases example generations */}
      <section className="gallery">
        <div className="container">
          <div className="section-title">
            <h3>Your Latest Compositions</h3>
            <p>Explore lyrics created by you</p>
          </div>
          {/* Grid of generation examples */}
          <div className="popular-mixes">
            {/* These will eventually be dynamically generated from backend data from the user
                For now, they're static examples to show the UI design */}
            
            {/* Example 1 - Chillwave */}
            <div className="mix-card-lyric">
              <div className="mix-card-lyric-content">
                <div className="mix-details">
                    <h4 className="mix-title">Ocean Breeze Chillwave</h4>
                    <div className="mix-creator">Prompt by SonicFlow</div>
                    <div className="mix-tags">
                        <span className="mix-tag">Chillwave</span>
                        <span className="mix-tag">Relaxing</span>
                        <span className="mix-tag">Ambient</span>
                    </div>
                </div>
                <div className="lyrics-container">
                    <h5>Lyrics</h5>
                    <div className="lyrics-text">
                        <p>This is where the lyrics for Ocean Breeze Chillwave would appear.</p>
                        <p>Each line or verse could be formatted in its own paragraph.</p>
                    </div>
                </div>
                {/* If we want to add download function */}
                {/*<div className="player-controls">
                    <button className="download-button">↓ Download</button>
                </div>*/}
              </div>
            </div>

            {/* Example 2 - Indie Rock */}
            <div className="mix-card-lyric">
              <div className="mix-card-lyric-content">
                <div className="mix-details">
                    <h4 className="mix-title">Golden Hour Indie Jam</h4>
                    <div className="mix-creator">Prompt by IndieDreamer</div>
                    <div className="mix-tags">
                      <span className="mix-tag">Indie</span>
                      <span className="mix-tag">Rock</span>
                      <span className="mix-tag">Upbeat</span>
                    </div>
                </div>
                <div className="lyrics-container">
                <h5>Lyrics</h5>
                <div className="lyrics-text">
                    <p>This is where the lyrics for Golden Hour Indie Jam would appear.</p>
                    <p>Each line or verse could be formatted in its own paragraph.</p>
                </div>
                </div>
                {/* If we want to add download function */}
                {/*<div className="player-controls">
                    <button className="download-button">↓ Download</button>
                </div>*/}
              </div>
            </div>

            {/* Example 3 - Synth Pop */}
            <div className="mix-card-lyric">
              <div className="mix-card-lyric-content">
                <div className="mix-details">
                    <h4 className="mix-title">Starlight Synth Pop</h4>
                    <div className="mix-creator">Prompt by NeonPulse</div>
                    <div className="mix-tags">
                    <span className="mix-tag">Synth Pop</span>
                    <span className="mix-tag">Retro</span>
                    <span className="mix-tag">Dance</span>
                    </div>
                </div>
                <div className="lyrics-container">
                <h5>Lyrics</h5>
                <div className="lyrics-text">
                    <p>This is where the lyrics for Starlight Synth Pop would appear.</p>
                    <p>Each line or verse could be formatted in its own paragraph.</p>
                </div>
                </div>
                {/* If we want to add download function */}
                {/*<div className="player-controls">
                    <button className="download-button">↓ Download</button>
                </div>*/}
              </div>
            </div>

            {/* Example 4 - Acoustic Folk */}
            <div className="mix-card-lyric">
              <div className="mix-card-lyric-content">
                <div className="mix-details">
                    <h4 className="mix-title">Sunset Acoustic Ballad</h4>
                    <div className="mix-creator">Prompt by FolkVibes</div>
                    <div className="mix-tags">
                    <span className="mix-tag">Acoustic</span>
                    <span className="mix-tag">Folk</span>
                    <span className="mix-tag">Mellow</span>
                    </div>
                </div>
                <div className="lyrics-container">
                  <h5>Lyrics</h5>
                  <div className="lyrics-text">
                      <p>This is where the lyrics for Sunset Acoustic Ballad would appear.</p>
                      <p>Each line or verse could be formatted in its own paragraph.</p>
                  </div>
                </div>
                {/* If we want to add download function */}
                {/*<div className="player-controls">
                    <button className="download-button">↓ Download</button>
                </div>*/}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
  
export default LyricGeneration;