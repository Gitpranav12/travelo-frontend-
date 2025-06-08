import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // ✅ import context
import Swal from "sweetalert2";

// 🟢 NEW: Define your API base URL using the environment variable
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext); // ✅ use context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      // 🟢 UPDATED API CALL FOR LOGIN 🟢
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid email or password",
          confirmButtonColor: "#d33",
        });
      } else {
        localStorage.setItem("token", data.token);
        loginUser(data.user);
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back!",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/");
      }
    } catch (err) { // Catch the actual error object
      console.error("Login error:", err); // Log the actual error for debugging
      setError("Server error. Please try again later."); // More user-friendly message
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="login-form-container">
      <Link to="/">
        <i className="fas fa-times" id="form-close" />
      </Link>
      <form onSubmit={handleSubmit}>
        <h3>Login</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="email"
          className="box"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <input type="submit" value="login now" className="btn" />
        <p>
          don't have any account? <Link to="/register">register now</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;