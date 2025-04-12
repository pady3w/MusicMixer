import React, { useState, useRef, useEffect } from "react";
import SearchBar from "../common/SearchBar";
import AudioPlayer from "../common/AudioPlayer";
import "../../styles/ChatArea.css";

const Home = () => {
  // State for tracking the user's prompt input
  const [prompt, setPrompt] = useState("");
  
  // State for tracking when music generation is in progress
  const [isGenerating, setIsGenerating] = useState(false);
  
  // State for storing the URL of the generated audio
  const [audioUrl, setAudioUrl] = useState(null);
  
  // State to track if audio is playing for waveform animation
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Handler for updating the prompt state when the user types
  const handlePromptChange = (value) => {
    setPrompt(value);
  };
  
  // The main function that handles sending the generation request to the backend
  const handleGenerate = async () => {
    // Don't proceed if the prompt is empty or just whitespace
    if (prompt.trim() === "") return;
    
    // Set generating state to true to show loading UI
    setIsGenerating(true);
    try {
      // Make the API request to the backend server
      const response = await fetch('http://localhost:3001/api/generate-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();  // Parse the JSON response
      console.log('Response from server:', data);  // Log the response for debugging
      
      // If the response is successful, parse the binary audio file
      if (data.success && data.data.audioUrl) {
        // const audioPlayer = document.createElement('audio');
        // audioPlayer.src = data.data.audioUrl;  // Use audioUrl from the response
        // audioPlayer.controls = true;
        // document.body.appendChild(audioPlayer);  // Append it to the page
        setAudioUrl(data.data.audioUrl);
  

      } else {
        console.log('Response from server:', data); 
        throw new Error('Failed to generate music');
      }
    } catch (error) {
      // Catch and log any errors during the fetch operation

      console.error('Error generating music:', error);
      
      // TODO: Add proper error handling for the user
    } finally {
      // Whether the request succeeds or fails, reset the generating state
      setIsGenerating(false);
    }
};


  return (
    <>
      {/* Hero section - This is the main banner at the top of the page */}
      <section className="hero">
        <div className="container">
          <h2>Music Generation Studio</h2>
          <p>Generate unique music with artificial intelligence. Simply describe your desired song, and our AI will create it for you.</p>
          
          {/* The prompt container holds the search input and generate button */}
          <div className="prompt-container">
            {/* Using SearchBar component for the prompt input */}
            <SearchBar 
              placeholder="Describe the music you want to create!" 
              onSearch={handleGenerate}
              onChange={handlePromptChange}
              value={prompt}
            />
            
            {/* Generate button that triggers the API call */}
            <button 
              className="btn btn-primary generate-btn" 
              onClick={handleGenerate}
              disabled={isGenerating || prompt.trim() === ""}
            >
              {isGenerating ? "Generating..." : "Generate Music"}
            </button>
            
            {/* Only showing the audio player and waveform after generation is complete */}
            {audioUrl && (
              <div className="generation-result">
                <div className="waveform">
                  <div className="waveform-graphic">
                    {[...Array(20)].map((_, index) => (
                      <div 
                        key={index} 
                        className={`wave-bar ${isPlaying ? 'animate-wave' : ''}`}
                        style={{
                          animationDelay: `${Math.random() * 0.5}s` // Randomize start times
                        }}
                      ></div>
                    ))}
                  </div>
                </div>

                <AudioPlayer 
                  src={audioUrl}  // Use the audioUrl state directly
                  onPlayPause={(playing) => setIsPlaying(playing)}
                />

                <button 
                  className="btn btn-secondary download-btn"
                  onClick={() => window.open(audioUrl, '_blank')}
                >
                  Download
                </button>
              </div>
            )}

          </div>
        </div>
      </section>
      
      {/* The rest of your existing code from Home.jsx */}
      <section className="features">
        <div className="container">
          <div className="section-title">
            <h3>How It Works</h3>
            <p>Creating AI-generated music has never been easier.</p>
          </div>
          
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">💭</div>
              <h4>Describe Your Vision</h4>
              <p>Enter a detailed prompt describing the style, mood, tempo, and instruments for your desired music.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h4>AI Generation</h4>
              <p>Our advanced machine learning model analyzes your prompt and creates a unique musical composition.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎧</div>
              <h4>Listen & Refine</h4>
              <p>Preview your generated music and make adjustments to further refine the sound to your liking.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="generation-demo">
        <div className="container">
          <div className="section-title">
            <h3>Try These Examples</h3>
            <p>Get inspired with these example prompts</p>
          </div>
          
          <div className="prompt-examples">
            <div className="prompt-card" onClick={() => {
              const input = document.querySelector('.chat-input');
              if (input) {
                input.value = "A lo-fi hip hop beat with jazzy piano samples and rain sounds";
                // Trigger input event to update state
                input.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }}>
              <p>"A lo-fi hip hop beat with jazzy piano samples and rain sounds"</p>
            </div>
            
            <div className="prompt-card" onClick={() => {
              const input = document.querySelector('.chat-input');
              if (input) {
                input.value = "An energetic EDM track with a heavy drop and futuristic synths";
                input.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }}>
              <p>"An energetic EDM track with a heavy drop and futuristic synths"</p>
            </div>
            
            <div className="prompt-card" onClick={() => {
              const input = document.querySelector('.chat-input');
              if (input) {
                input.value = "A gentle acoustic guitar melody with nature sounds";
                input.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }}>
              <p>"A gentle acoustic guitar melody with nature sounds"</p>
            </div>
          </div>
        </div>
      </section>

      <section className="gallery">
        <div className="container">
          <div className="section-title">
            <h3>Community Creations</h3>
            <p>Explore music created by our AI based on community prompts</p>
          </div>
          
          <div className="popular-mixes">
            <div className="mix-card">
              <div className="mix-img">
                <img src="/placeholder.jpg" alt="Waveform visualization" />
                <div className="play-icon">▶️</div>
              </div>
              <div className="mix-details">
                <h4 className="mix-title">Cyberpunk City Ambience</h4>
                <div className="mix-creator">Prompt by TechnoVerse</div>
                <div className="mix-tags">
                  <span className="mix-tag">Electronic</span>
                  <span className="mix-tag">Ambient</span>
                  <span className="mix-tag">Futuristic</span>
                </div>
              </div>
            </div>
            
            <div className="mix-card">
              <div className="mix-img">
                <img src="/placeholder.jpg" alt="Waveform visualization" />
                <div className="play-icon">▶️</div>
              </div>
              <div className="mix-details">
                <h4 className="mix-title">Rainy Jazz Café</h4>
                <div className="mix-creator">Prompt by MelodyMaster</div>
                <div className="mix-tags">
                  <span className="mix-tag">Jazz</span>
                  <span className="mix-tag">Lo-Fi</span>
                  <span className="mix-tag">Relaxing</span>
                </div>
              </div>
            </div>
            
            <div className="mix-card">
              <div className="mix-img">
                <img src="/placeholder.jpg" alt="Waveform visualization" />
                <div className="play-icon">▶️</div>
              </div>
              <div className="mix-details">
                <h4 className="mix-title">Epic Fantasy Battle</h4>
                <div className="mix-creator">Prompt by OrchestralDreams</div>
                <div className="mix-tags">
                  <span className="mix-tag">Orchestral</span>
                  <span className="mix-tag">Epic</span>
                  <span className="mix-tag">Fantasy</span>
                </div>
              </div>
            </div>
            
            <div className="mix-card">
              <div className="mix-img">
                <img src="/placeholder.jpg" alt="Waveform visualization" />
                <div className="play-icon">▶️</div>
              </div>
              <div className="mix-details">
                <h4 className="mix-title">Retro Synthwave Drive</h4>
                <div className="mix-creator">Prompt by NeonRider</div>
                <div className="mix-tags">
                  <span className="mix-tag">Synthwave</span>
                  <span className="mix-tag">Retro</span>
                  <span className="mix-tag">80s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;