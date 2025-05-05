import React, { useState, useRef, useEffect } from "react";

const ChatArea = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
  //  scrollToBottom();
  }, [messages]);

 /* const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };*/
// Modified handleSubmit function to prevent duplicate outputs
const handleSubmit = async (e) => {
  e.preventDefault();
   
  if (prompt.trim() === "" || isGenerating) return;
  
  // Set generating state first
  setIsGenerating(true);
  
  // Create all IDs upfront
  const userMessageId = Date.now();
  const lyricsLoadingId = userMessageId + 1;
  const userPrompt = prompt;
  
  // Update with both messages at once to reduce renders
  setMessages(prev => [
    ...prev, 
    { role: "user", content: userPrompt, id: userMessageId },
    { id: lyricsLoadingId, role: "assistant", content: "Generating lyrics...", isLoading: true }
  ]);
  
  // Clear input
  setPrompt("");
  
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
      // Create musicLoadingId once
      const musicLoadingId = Date.now();
      
      // Update with both the lyrics result and music loading message at once
      setMessages(prev => {
        // First, update the lyrics loading message
        //const updatedWithLyrics = 
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
          // Single state update for music result
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