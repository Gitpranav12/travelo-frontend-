import React, { useState, useContext, useEffect, useRef } from "react";
import tavel from './assets/tavel.jpg';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import debounce from "lodash.debounce"; // 👈 Add debounce

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

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
  const [loadingCities, setLoadingCities] = useState(false); // 👈 Loader state

  const [responseMsg, setResponseMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const fetchCities = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }
    setLoadingCities(true); // Start loader
    try {
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
    setLoadingCities(false); // Stop loader
  };

  const debouncedFetchCities = useRef(
    debounce((input) => {
      fetchCities(input);
    }, 400)
  ).current;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "from" || name === "to") {
      debouncedFetchCities(value);
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
      userId = decoded?.id || decoded?._id;
    }

    if (!userId) {
      setResponseMsg("User ID not found. Please login again.");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000);
      return;
    }

    try {
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
        setTimeout(() => setShowPopup(false), 5000);
      } else {
        setResponseMsg(data.message || "Booking failed");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 5000);
      }
    } catch (err) {
      console.error("Booking submission error:", err);
      setResponseMsg("Server error. Please try again.");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000);
    }
  };

  return (
    
   <>
  <style>{`
  .city-loader-wrapper {
    width: 200px;
    height: 60px;
    position: relative;
    margin: 0 auto;
    z-index: 1;
  }

  .city-loader-wrapper .circle {
    width: 20px;
    height: 20px;
    position: absolute;
    border-radius: 50%;
    background-color: #333;
    left: 15%;
    transform-origin: 50%;
    animation: circle7124 .5s alternate infinite ease;
  }

  @keyframes circle7124 {
    0% {
      top: 60px;
      height: 5px;
      border-radius: 50px 50px 25px 25px;
      transform: scaleX(1.7);
    }
    40% {
      height: 20px;
      border-radius: 50%;
      transform: scaleX(1);
    }
    100% {
      top: 0%;
    }
  }

  .city-loader-wrapper .circle:nth-child(2) {
    left: 45%;
    animation-delay: .2s;
  }

  .city-loader-wrapper .circle:nth-child(3) {
    left: auto;
    right: 15%;
    animation-delay: .3s;
  }

  .city-loader-wrapper .shadow {
    width: 20px;
    height: 4px;
    border-radius: 50%;
    background-color: rgba(0,0,0,0.4);
    position: absolute;
    top: 62px;
    transform-origin: 50%;
    z-index: -1;
    left: 15%;
    filter: blur(1px);
    animation: shadow046 .5s alternate infinite ease;
  }

  @keyframes shadow046 {
    0% {
      transform: scaleX(1.5);
    }
    40% {
      transform: scaleX(1);
      opacity: .7;
    }
    100% {
      transform: scaleX(.2);
      opacity: .4;
    }
  }

  .city-loader-wrapper .shadow:nth-child(4) {
    left: 45%;
    animation-delay: .2s;
  }

  .city-loader-wrapper .shadow:nth-child(5) {
    left: auto;
    right: 15%;
    animation-delay: .3s;
  }
`}</style>


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
                    debouncedFetchCities(formData[field]);
                    setActiveField(field);
                    setShowSuggestions(true);
                  }
                }}
                required
              />
              {showSuggestions && activeField === field && (
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
                 {loadingCities ? (
  <li style={{ padding: "10px", textAlign: "center" }}>
    <div className="city-loader-wrapper">
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="shadow"></div>
      <div className="shadow"></div>
      <div className="shadow"></div>
    </div>
  </li>
): suggestions.length > 0 ? (
                    suggestions.map((s, i) => (
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
                    ))
                  ) : (
                    <li style={{ padding: "8px", textAlign: "center", color: "#888" }}>
                      No results
                    </li>
                  )}
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

      {responseMsg && !showPopup && <p style={{ color: "green", marginTop: "1rem" }}>{responseMsg}</p>}

      {showPopup && (
        <div style={{
          position: 'fixed',
          top: '60px',
          right: '10px',
          backgroundColor: responseMsg.includes('failed') || responseMsg.includes('error') ? '#f44336' : '#4caf50',
          color: 'white',
          padding: '10px 20px',
          fontSize: '12px',
          height: '40px',
          borderRadius: '5px',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 1000
        }}>
          {responseMsg}
          <button onClick={() => setShowPopup(false)} style={{
            marginLeft: '10px',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            lineHeight: '1',
          }}>X</button>
        </div>
      )}
    </section>
   </>
  );
}
export default Book;
