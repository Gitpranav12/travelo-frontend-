// client/src/Components/ResetPassword.jsx
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

// Backend API URL prefix ko confirm karein
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { resettoken } = useParams(); // URL se token lene ke liye
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (password !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Passwords do not match!",
                confirmButtonColor: "#d33",
            });
            setLoading(false);
            return;
        }

        try {
            // URL badla gaya hai: /users/resetpassword se /auth/resetpassword
            const res = await fetch(`${API_BASE_URL}/auth/resetpassword/${resettoken}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password, confirmPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: data.message,
                    confirmButtonColor: "#3085d6",
                });
                // Password reset hone ke baad login page par redirect karein
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.message || "Failed to reset password. Invalid or expired token.",
                    confirmButtonColor: "#d33",
                });
            }
        } catch (err) {
            console.error("Reset password error:", err);
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
                    <h3>Reset Password</h3>
                    <input
                        type="password"
                        className="box"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="box"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                    <p>
                        <Link to="/login">Back to Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;