import React, { useRef, useState, useEffect } from 'react';

const AudioPlayer = ({ src }) => {
  // I'm using a ref to interact with the audio element directly
  // This gives me more control than just using state
  const audioRef = useRef(null);
  
  // State to track whether the audio is currently playing
  // This lets me update the UI and toggle play/pause
  const [isPlaying, setIsPlaying] = useState(false);
  
  // State to track audio duration and current time
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  // State to track any potential errors
  const [error, setError] = useState(null);

  // Helper function to format time in MM:SS
  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Effect to set up time tracking and error reset
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Reset states when source changes
    setError(null);
    setIsPlaying(false);
    setCurrentTime(0);

    // Handlers for audio events
    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    // Add event listeners
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    // Cleanup listeners
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src]);
  
  // This function handles toggling between play and pause
  const togglePlayPause = () => {
    // Don't do anything if we don't have an audio element reference
    if (!audioRef.current) return;
    
    // If currently playing, pause it
    // Otherwise, start playing
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // This returns a promise but we don't need to await it here
      // The play state will be updated via the event listeners
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setError(null);
        })
        .catch(err => {
          // Sometimes play() can fail, especially if the src is invalid
          // or if the browser has policies that prevent autoplay
          console.error('Error playing audio:', err);
          setError(err.message);
          setIsPlaying(false);
        });
    }
  };
  
  return (
    <div className="audio-player">
      {/* The actual audio element - hidden from view but controlled via my custom UI */}
      <audio 
        ref={audioRef}
        src={src} 
        // I'm including the native controls but hiding them
        // This makes testing easier and provides a fallback
        controls
        style={{ display: 'none' }}
      />
      
      <div className="audio-controls flex items-center">
        {/* My custom play/pause button */}
        <button 
          className="btn btn-primary play-btn mr-4"
          onClick={togglePlayPause}
          disabled={!src} // Disable the button if no audio source is provided
        >
          {/* Dynamic label based on play state */}
          {isPlaying ? "Pause" : "Play Latest Generation"}
        </button>
        
        {/* Audio time display */}
        <div className="audio-time text-sm">
          <span>{formatTime(currentTime)}</span>
          <span> / </span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="audio-error text-red-500 mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;