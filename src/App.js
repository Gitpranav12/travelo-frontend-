// App.js
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import { UserProvider } from './context/UserContext'; // ✅ Add this
import Profile from './Components/Profile'; // ✅ Import Profile component

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
