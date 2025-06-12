// client/src/Components/Login.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Swal from "sweetalert2";

// Backend API URL prefix ko confirm karein
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { loginUser } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            // URL badla gaya hai: /users/login se /auth/login
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
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
        } catch (err) {
            console.error("Login error:", err);
            setError("Server error. Please try again later.");
            Swal.fire({
                icon: "error",
                title: "Server Error",
                text: "Something went wrong. Please try again later.",
                confirmButtonColor: "#d33",
            });
        }
    };

    return (
        <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: -1,
                }}
            >
                <source src="/background.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Login Form */}
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
                    <p>
                        <Link to="/forgotpassword">Forgot Password?</Link> {/* Naya Link */}
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;