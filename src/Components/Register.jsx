import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Loading state add kiya
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true); // Submission start hone par loading true karein
        try {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, number, password }),
            });
            const data = await res.json();
            setLoading(false); // Response aane ke baad loading false karein

            if (!res.ok) {
                setError(data.message || "Registration failed");
                Swal.fire({
                    icon: "error",
                    title: "Registration Failed",
                    text: data.message || "User already exists or invalid data.",
                    confirmButtonColor: "#d33",
                });
            } else {
                Swal.fire({
                    icon: "success",
                    title: "Registration Successful",
                    text: "You can now log in!",
                    timer: 1500,
                    showConfirmButton: false,
                });
                navigate("/login"); // Successful registration ke baad login page par redirect karein
            }
        } catch (err) {
            console.error("Registration error:", err);
            setLoading(false); // Error hone par bhi loading false karein
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
                <source src="/background1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="login-form-container">
                <Link to="/">
                    <i className="fas fa-times" id="form-close" />
                </Link>
                <form onSubmit={handleSubmit}>
                    <h3>Register</h3>

                    {/* Loading message display karein */}
                    {loading && (
                        <p style={{ color: "blue", fontWeight: "bold" }}>
                            Please wait... creating your account
                        </p>
                    )}

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
                        type="text"
                        className="box"
                        placeholder="Enter your number"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="box"
                        placeholder="Create password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input type="submit" value="register now" className="btn" disabled={loading} /> {/* Button disable karein loading ke dauran */}
                    <p>
                        already have an account? <Link to="/login">login now</Link>
                    </p>
                    <p>
                        <Link to="/forgotpassword">Forgot Password?</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;