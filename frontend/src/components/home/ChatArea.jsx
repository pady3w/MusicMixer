import React, { useState, useRef, useEffect } from "react";

const ChatArea = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (prompt.trim() === "") return;
    
    // Add user message
    const userMessage = { role: "user", content: prompt, id: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input
    const userPrompt = prompt;
    setPrompt("");
    
    // Add assistant "typing" message for lyrics generation
    setIsGenerating(true);
    const lyricsLoadingId = Date.now();
    setMessages(prev => [...prev, { 
      id: lyricsLoadingId,
      role: "assistant", 
      content: "Generating lyrics...", 
      isLoading: true 
    }]);
    
    try {
      // Step 1: Generate lyrics using OpenAI
      const lyricsResponse = await fetch('http://localhost:3001/api/generate-lyrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userPrompt }),
      });
      
      if (!lyricsResponse.ok) {
        throw new Error(`Failed to generate lyrics: ${lyricsResponse.status}`);
      }
      
      const lyricsData = await lyricsResponse.json();
      
      if (lyricsData.success) {
        // Update the loading message with lyrics
        setMessages(prev => {
          return prev.map(msg => {
            if (msg.id === lyricsLoadingId) {
              return {
                id: msg.id,
                role: "assistant",
                content: lyricsData.data.lyrics,
                type: "lyrics"
              };
            }
            return msg;
          });
        });
        
        // Add another loading message for music generation
        const musicLoadingId = Date.now();
        setMessages(prev => [...prev, { 
          id: musicLoadingId,
          role: "assistant", 
          content: "Composing music based on these lyrics...", 
          isLoading: true 
        }]);
        
        // Step 2: Generate music
        try {
          const musicResponse = await fetch('http://localhost:3001/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              prompt: userPrompt,
              lyrics: lyricsData.data.lyrics 
            }),
          });
          
          if (!musicResponse.ok) {
            throw new Error(`Failed to generate music: ${musicResponse.status}`);
          }
          
          const musicData = await musicResponse.json();
          
          if (musicData.success && musicData.data.audioUrl) {
            // Update the music loading message with the audio player
            setMessages(prev => {
              return prev.map(msg => {
                if (msg.id === musicLoadingId) {
                  return {
                    id: msg.id,
                    role: "assistant",
                    content: "Music generated successfully! Listen below:",
                    type: "music",
                    audioUrl: musicData.data.audioUrl
                  };
                }
                return msg;
              });
            });
          } else {
            throw new Error("Failed to generate music");
          }
        } catch (musicError) {
          console.error("Music generation error:", musicError);
          
          // Update the music loading message with error
          setMessages(prev => {
            return prev.map(msg => {
              if (msg.id === musicLoadingId) {
                return {
                  id: msg.id,
                  role: "assistant",
                  content: "Failed to generate music. Please try again.",
                  type: "error"
                };
              }
              return msg;
            });
          });
        }
      } else {
        throw new Error("Lyrics generation failed");
      }
    } catch (error) {
      console.error("Error in generation process:", error);
      
      // Update any loading message with error
      setMessages(prev => {
        return prev.map(msg => {
          if (msg.isLoading) {
            return {
              id: msg.id,
              role: "assistant",
              content: "An error occurred during generation. Please try again.",
              type: "error"
            };
          }
          return msg;
        });
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="chat-area">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <p>Describe the music you want to create, and I'll generate lyrics and a matching track.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.role}-message ${message.type === "error" ? "error-message" : ""}`}
            >
              {message.isLoading ? (
                <div className="message-content loading">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <p>{message.content}</p>
                </div>
              ) : (
                <div className="message-content">
                  {message.type === "lyrics" ? (
                    <div className="lyrics-block">
                      <h4>Generated Lyrics:</h4>
                      <pre>{message.content}</pre>
                    </div>
                  ) : message.type === "music" ? (
                    <div className="music-block">
                      <p>{message.content}</p>
                      {message.audioUrl && (
                        <div className="audio-player-container">
                          <audio 
                            controls 
                            src={message.audioUrl}
                            className="audio-player"
                          ></audio>
                          <button 
                            className="download-button"
                            onClick={() => window.open(message.audioUrl, '_blank')}
                          >
                            Download
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the music you want to create..."
          disabled={isGenerating}
          className="chat-input"
        />
        <button 
          type="submit" 
          disabled={isGenerating || prompt.trim() === ""}
          className="send-button"
        >
          {isGenerating ? (
            <div className="loading-spinner"></div>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatArea;