import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// 🟢 NEW: Define your API base URL using the environment variable
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState(""); // ✅ Phone Number state
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!name || !email || !number || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      // 🟢 UPDATED API CALL FOR REGISTRATION 🟢
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, number, password }), // ✅ Include number
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration Failed");
      } else {
        Swal.fire({
          title: "Success!",
          text: "Registration successful. Please login.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err); // Log the actual error for debugging
      setError("Server error. Please try again."); // More user-friendly message
    }
  };

  return (
    <div className="login-form-container">
      <Link to="/">
        <i className="fas fa-times" id="form-close" style={{ cursor: "pointer" }}></i>
      </Link>

      <form onSubmit={handleSubmit}>
        <h3>Register</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="text"
          className="box"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          className="box"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel" // Use type="tel" for phone numbers
          className="box"
          placeholder="Enter your phone number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
        />
        <input
          type="password"
          className="box"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input type="submit" value="Register now" className="btn" />
        <input type="checkbox" id="remember" />
        <label htmlFor="remember">remember me</label>
        <p>
          forget password? <a href="/">click here</a>
        </p>
        <p>
          Already have account..? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;