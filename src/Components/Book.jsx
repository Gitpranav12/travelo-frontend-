import React, { useState, useContext, useEffect, useRef } from "react";
import tavel from './assets/tavel.jpg'; // Assuming this path is correct for your asset
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

// 🟢 NEW: Define your API base URL using the environment variable
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Helper to decode JWT token to extract user info
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

function Book() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    guests: "",
    arrival: "",
    leaving: ""
  });

  const [suggestions, setSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const suggestionsRef = useRef(null);

  const [responseMsg, setResponseMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const fetchCities = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }
    try {
      // 🟢 UPDATED API CALL FOR CITIES 🟢
      const res = await fetch(`${API_BASE_URL}/cities?search=${input}`);
      const data = await res.json();
      if (res.ok) {
        setSuggestions(data.map(city => city.name));
        setHighlightIndex(-1);
      }
    } catch (err) {
      console.error("City fetch error:", err);
      setSuggestions([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "from" || name === "to") {
      fetchCities(value);
      setActiveField(name);
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[highlightIndex]);
    }
  };

  const handleSuggestionClick = (value) => {
    setFormData((prev) => ({ ...prev, [activeField]: value }));
    setSuggestions([]);
    setShowSuggestions(false);
    setHighlightIndex(-1);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setHighlightIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user && !localStorage.getItem("token")) {
      navigate('/register');
      return;
    }

    const token = localStorage.getItem("token");
    let userId = user?._id;

    if (!userId && token) {
      const decoded = parseJwt(token);
      // Ensure we're using the correct field from the decoded token (id or _id)
      userId = decoded?.id || decoded?._id; 
    }

    if (!userId) {
      setResponseMsg("User ID not found. Please login again.");
      setShowPopup(true); // Show popup for this message as well
      setTimeout(() => setShowPopup(false), 5000); // Hide after 5 seconds
      return;
    }

    try {
      // 🟢 UPDATED API CALL FOR BOOKING 🟢
      const response = await fetch(`${API_BASE_URL}/bookings/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMsg(data.message);
        setShowPopup(true);
        setFormData({ from: '', to: '', guests: '', arrival: '', leaving: '' });
        // Reduced popup display time for better UX, adjust as needed
        setTimeout(() => setShowPopup(false), 5000); // Example: hide after 5 seconds
      } else {
        setResponseMsg(data.message || "Booking failed");
        setShowPopup(true); // Show popup for errors too
        setTimeout(() => setShowPopup(false), 5000); // Hide after 5 seconds
      }
    } catch (err) {
      console.error("Booking submission error:", err); // Log the actual error for debugging
      setResponseMsg("Server error. Please try again.");
      setShowPopup(true); // Show popup for server errors
      setTimeout(() => setShowPopup(false), 5000); // Hide after 5 seconds
    }
  };

  return (
    <section className="book" id="book">
      <h1 className="heading">
        <span>b</span><span>o</span><span>o</span><span>k</span>
        <span className="space"></span>
        <span>n</span><span>o</span><span>w</span>
      </h1>

      <div className="row">
        <div className="image">
          <img src={tavel} alt="travel" />
        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
          {["from", "to"].map((field) => (
            <div className="inputBox" style={{ position: 'relative' }} ref={suggestionsRef} key={field}>
              <h3>{field === "from" ? "From" : "To"}</h3>
              <input
                type="text"
                placeholder="place name"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (formData[field].length > 0) {
                    fetchCities(formData[field]);
                    setActiveField(field);
                    setShowSuggestions(true);
                  }
                }}
                required
              />
              {showSuggestions && activeField === field && suggestions.length > 0 && (
                <ul style={{
                  listStyleType: "none",
                  margin: 0,
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  maxHeight: "150px",
                  overflowY: "auto",
                  backgroundColor: "white",
                  position: "absolute",
                  width: "100%",
                  zIndex: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                }}>
                  {suggestions.map((s, i) => (
                    <li key={i}
                      onClick={() => handleSuggestionClick(s)}
                      style={{
                        padding: "5px",
                        cursor: "pointer",
                        backgroundColor: highlightIndex === i ? "#eee" : "white"
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="inputBox">
            <h3>how many</h3>
            <input
              type="number"
              placeholder="number of guests"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              required
            />
          </div>
          <div className="inputBox">
            <h3>arrivals</h3>
            <input
              type="date"
              name="arrival"
              value={formData.arrival}
              onChange={handleChange}
              required
            />
          </div>
          <div className="inputBox">
            <h3>leaving</h3>
            <input
              type="date"
              name="leaving"
              value={formData.leaving}
              onChange={handleChange}
              required
            />
          </div>
          <input type="submit" className="btn" value="book now" />
        </form>
      </div>

      {responseMsg && !showPopup && <p style={{ color: "green", marginTop: "1rem" }}>{responseMsg}</p>} {/* Only show if popup is not active */}

      {showPopup && (
        <div style={{
          position: 'fixed',
          top: '60px',
          right: '10px',
          backgroundColor: responseMsg.includes('failed') || responseMsg.includes('error') ? '#f44336' : '#4caf50', // Red for errors, green for success
          color: 'white',
          padding: '10px 20px',
          fontSize: '12px',
          height: '40px',
          borderRadius: '5px',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          display: 'flex', // Use flex for alignment
          alignItems: 'center', // Center vertically
          justifyContent: 'space-between', // Space out message and button
          zIndex: 1000 // Ensure it's on top
        }}>
          {responseMsg}
          <button onClick={() => setShowPopup(false)} style={{
            marginLeft: '10px',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px', // Make X button a bit larger
            lineHeight: '1', // Ensure it's vertically centered
          }}>X</button>
        </div>
      )}
    </section>
  );
}
export default Book;