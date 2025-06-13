// client/src/App.js
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register'; // Register component agar hai
import Profile from './Components/Profile'; // Profile component agar hai
import ForgotPassword from './Components/ForgotPassword'; // ForgotPassword ko import karein
import ResetPassword from './Components/ResetPassword';   // ResetPassword ko import karein
import { UserProvider } from './context/UserContext';
import KommunicateChat from './chat'; // KommunicateChat ko import karein

function App() {
    return (
        <UserProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> {/* Register route */}
                <Route path="/profile" element={<Profile />} /> {/* Profile route */}
                <Route path="/forgotpassword" element={<ForgotPassword />} />         {/* Naya route */}
                <Route path="/resetpassword/:resettoken" element={<ResetPassword />} /> {/* Naya route token ke saath */}
            </Routes>
             <KommunicateChat />
        </UserProvider>
    );
}

export default App;