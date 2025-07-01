// client/src/context/UserContext.js
import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Initialize user state from localStorage
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // This function is called by Login.jsx (for both traditional and Google login)
    const loginUser = (userData) => {
        setUser(userData);
        // localStorage.setItem("token", data.token); is already handled in Login.jsx
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token"); // Also remove the JWT token
        // Optional: If you want to explicitly sign out from Google's client-side session (less common for JWT-based apps)
        if (window.google && window.google.accounts && window.google.accounts.id) {
            // No direct client-side sign-out needed for Google Identity Services (GSI)
            // if you're primarily relying on your own backend session (JWT).
            // GSI's "logout" mainly revokes consent if the user clicked "Stay signed in".
            // Clearing your app's local storage and backend session is usually sufficient.
        }
    };

    // No need for a useEffect to fetch '/api/auth/me' as your context relies on
    // localStorage for initial load and explicit calls to loginUser/logoutUser.
    // If you later decide you *do* need to re-validate the token on every page load
    // (e.g., to check token expiry or get fresh user data), then you would add a
    // useEffect here to call a backend endpoint.
    // For now, based on your provided UserContext, this is the correct structure.


    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};