import React from "react";

const TrackItem = ({ type, title, artist, onPlay, onRemove }) => {
  return (
    <div className="track">
      <div className="track-type">{type}</div>
      <div className="track-info">
        <div className="track-title">{title}</div>
        <div className="track-artist">{artist}</div>
      </div>
      <div className="track-actions">
        <button className="track-btn" onClick={onPlay}>▶️</button>
        <button className="track-btn" onClick={onRemove}>✖️</button>
      </div>
    </div>
  );
};

// Default props in case they're not provided
TrackItem.defaultProps = {
  type: "Track",
  title: "Untitled Track",
  artist: "Unknown Artist",
  onPlay: () => console.log("Play clicked"),
  onRemove: () => console.log("Remove clicked")
};

export default TrackItem;