import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Swal from "sweetalert2";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { loginUser } = useContext(UserContext);

    // Google credential response handle karne wala function, useCallback mein wrap kiya gaya hai.
    // Isse ye function tabhi recreate hoga jab iski dependencies (setLoading, setError, loginUser, navigate) change hongi.
    const handleGoogleCredentialResponse = useCallback(async (response) => {
        console.log("Encoded JWT ID token from Google:", response.credential);
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_BASE_URL}/auth/google-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: response.credential }),
            });

            const data = await res.json();
            setLoading(false);

            if (!res.ok) {
                setError(data.message || 'Google login failed.');
                Swal.fire({
                    icon: "error",
                    title: "Google Login Failed",
                    text: data.message || "Failed to authenticate with Google.",
                    confirmButtonColor: "#d33",
                });
            } else {
                localStorage.setItem("token", data.token);
                loginUser(data.user);
                Swal.fire({
                    icon: "success",
                    title: "Google Login Successful",
                    text: "Welcome back!",
                    timer: 1500,
                    showConfirmButton: false,
                });
                navigate("/");
            }
        } catch (err) {
            console.error('Google login fetch error:', err);
            setLoading(false);
            setError("Server error during Google login. Please try again.");
            Swal.fire({
                icon: "error",
                title: "Server Error",
                text: "Could not connect to the server for Google login.",
                confirmButtonColor: "#d33",
            });
        }
    }, [setLoading, setError, loginUser, navigate]); // Ye dependencies useCallback ke liye hain

    // Google Sign-In button ko initialize aur render karne ke liye useEffect.
    // handleGoogleCredentialResponse ab useEffect ki dependency hai.
    useEffect(() => {
        // Debugging ke liye: Apne browser console mein client ID dekhein
        console.log("DEBUG: REACT_APP_GOOGLE_CLIENT_ID:", process.env.REACT_APP_GOOGLE_CLIENT_ID);

        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                callback: handleGoogleCredentialResponse,
                context: "signin",
                auto_prompt: false
            });

            // Google button ko render karein dark theme ke saath
            window.google.accounts.id.renderButton(
                document.getElementById("googleSignInDiv"),
                {
                    theme: "filled_black", // Dark blue button (ya "filled_black" black ke liye)
                    size: "large",
                    text: "signin_with",
                    shape: "rectangular",
                    logo_alignment: "left",
                }
            );
        }
    }, [handleGoogleCredentialResponse]); // handleGoogleCredentialResponse yahan dependency mein hai

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            setLoading(false);

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
            setLoading(false);
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
                <source src="/background.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="login-form-container">
                <Link to="/">
                    <i className="fas fa-times" id="form-close" />
                </Link>
                <form onSubmit={handleSubmit}>
                    <h3>Login</h3>

                    {loading && (
                        <p style={{ color: "blue", fontWeight: "bold" }}>
                            Please wait... logging you in
                        </p>
                    )}

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
                    <input type="submit" value="login now" className="btn" disabled={loading} />

                    {/* Google Sign-In button container */}
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <div id="googleSignInDiv"></div>
                    </div>

                    <p>
                        don't have any account? <Link to="/register">register now</Link>
                    </p>
                    <p>
                        <Link to="/forgotpassword">Forgot Password?</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;