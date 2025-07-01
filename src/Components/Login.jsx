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

    // Function to handle Google credential response
    // Wrapped in useCallback to prevent re-creation on every render,
    // which helps stabilize the useEffect dependency.
    const handleGoogleCredentialResponse = useCallback(async (response) => {
        console.log("Encoded JWT ID token from Google:", response.credential);
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_BASE_URL}/auth/google-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: response.credential }), // Send the ID token to your backend
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
                loginUser(data.user); // Pass the user object received from backend
                Swal.fire({
                    icon: "success",
                    title: "Google Login Successful",
                    text: "Welcome back!",
                    timer: 1500,
                    showConfirmButton: false,
                });
                navigate("/"); // Redirect to home or dashboard
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
    }, [setLoading, setError, loginUser, navigate]); // Dependencies for useCallback

    // Google Sign-In Initialization
    useEffect(() => {
        // Add this console.log temporarily for debugging client_id issue if it persists
        console.log("DEBUG: REACT_APP_GOOGLE_CLIENT_ID:", process.env.REACT_APP_GOOGLE_CLIENT_ID);

        // Check if window.google is available (script loaded)
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                callback: handleGoogleCredentialResponse, // Our new callback function
                context: "signin", // Or "use" if appropriate
                auto_prompt: false // Set to true if you want auto one-tap prompt
            });

            // Render the Google button into the specified div
            window.google.accounts.id.renderButton(
                document.getElementById("googleSignInDiv"), // Target element for the button
                {
                    theme: "filled_black", // Optional: Change theme to filled black
                    size: "large",
                    text: "signin_with",
                    shape: "rectangular",
                    logo_alignment: "center",
                    width: 250, // Optional: Set width for the button
                    // You can adjust width
                }
            );
            // Optional: for One Tap prompt
            // window.google.accounts.id.prompt();
        }
    }, [handleGoogleCredentialResponse]); // handleGoogleCredentialResponse is now a stable dependency

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
                loginUser(data.user); // Use loginUser from context
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

                        <div id="googleSignInDiv"></div> {/* This is where Google button will render */}
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