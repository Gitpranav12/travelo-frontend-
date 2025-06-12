// client/src/Components/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

// Backend API URL prefix ko confirm karein
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // URL badla gaya hai: /users/forgotpassword se /auth/forgotpassword
            const res = await fetch(`${API_BASE_URL}/auth/forgotpassword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Email Sent",
                    text: data.message,
                    confirmButtonColor: "#3085d6",
                });
                setEmail(''); // Email field ko clear karein
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.message || "Failed to send reset email. Please try again.",
                    confirmButtonColor: "#d33",
                });
            }
        } catch (err) {
            console.error("Forgot password error:", err);
            Swal.fire({
                icon: "error",
                title: "Server Error",
                text: "Something went wrong. Please try again later.",
                confirmButtonColor: "#d33",
            });
        } finally {
            setLoading(false);
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
                    <h3>Forgot Password</h3>
                    <p>Enter your email address to receive a password reset link.</p>
                    <input
                        type="email"
                        className="box"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                    <p>
                        Remembered your password? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;