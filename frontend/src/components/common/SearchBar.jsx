import React, { useState, useEffect } from "react";

const SearchBar = ({ placeholder, onSearch, onChange, value }) => {
  const [searchTerm, setSearchTerm] = useState(value || "");

  useEffect(() => {
    if (value !== undefined) {
      setSearchTerm(value);
    }
  }, [value]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-bar prompt-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
        />
        <span className="search-icon" onClick={handleSubmit}>🔍</span>
      </form>
    </div>
  );
};

export default SearchBar;