import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import ProfileIcon from "./ProfileIcon";
import { UserContext } from "../context/UserContext";
import debounce from "lodash.debounce";

const NAV_ITEMS = ["home", "book", "packages", "services", "gallery", "contact"];
const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/cities`;

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
};

// ✅ City search hook
const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const cache = useRef({});

  const fetchCities = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    if (cache.current[query]) {
      setSuggestions(cache.current[query]);
      setShowSuggestions(true);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}?search=${query}`);
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      const names = data.map(({ name }) => name);
      cache.current[query] = names;
      setSuggestions(names);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useRef(debounce(fetchCities, 150)).current;

  useEffect(() => {
    debouncedFetch(searchTerm);
  }, [searchTerm, debouncedFetch]);

  return {
    searchTerm,
    setSearchTerm,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    fetchCities,
    loading,
  };
};

const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, callback]);
};

function Header() {
  const { user } = useContext(UserContext);
  const suggestionsRef = useRef(null);
  const windowWidth = useWindowSize();

  const {
    searchTerm,
    setSearchTerm,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    fetchCities,
    loading,
  } = useSearch();

  const [menuActive, setMenuActive] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  useClickOutside(suggestionsRef, () => setShowSuggestions(false));

  useEffect(() => {
    if (windowWidth > 768) setMenuActive(false);
  }, [windowWidth]);

  const handleSelectSuggestion = (name) => {
    setSearchTerm(name);
    setShowSuggestions(false);
  };

  const isMobile = windowWidth <= 768;

  return (
    <header className="header">
      <div
        id="menu-bar"
        className={`fas fa-bars menu-bar ${isMobile ? "active" : ""}`}
        onClick={() => setMenuActive(!menuActive)}
        role="button"
        tabIndex={0}
      />
      <a href="/" className="logo">
        <span>T</span>ravelo
      </a>
      <nav className={`navbar ${menuActive ? "active" : ""}`}>
        {NAV_ITEMS.map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuActive(false)}>
            {item}
          </a>
        ))}
      </nav>
      <div className="icons">
        <i
          className="fas fa-search"
          id="search-btn"
          onClick={() => setSearchActive(!searchActive)}
          role="button"
          tabIndex={0}
        />
        {user ? (
          <ProfileIcon />
        ) : (
          <Link to="/login">
            <i className="fas fa-user" id="login-btn" />
          </Link>
        )}
      </div>
      <form
        className={`search-form ${searchActive ? "active" : ""}`}
        ref={suggestionsRef}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="search"
          id="search-bar"
          placeholder="Search here..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (searchTerm.trim().length > 0) {
              fetchCities(searchTerm);
              setShowSuggestions(true);
            }
          }}
          autoComplete="off"
        />
        {showSuggestions && (
          <ul className="suggestions-list">
            {loading ? (
              <li className="loader-wrapper">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
              </li>
            ) : (
              suggestions.map((city) => (
                <li key={city} onClick={() => handleSelectSuggestion(city)}>
                  {city}
                </li>
              ))
            )}
          </ul>
        )}
      </form>
    </header>
  );
}

export default Header;
