// src/components/ProfileIcon.jsx
import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

const ProfileIcon = () => {
  const { user, logoutUser } = useContext(UserContext);

  if (!user) return null;

  return (
    <div className="flex gap-4 items-center ml-4">
      <Link to="/profile" className="header-button">
        Profile
      </Link>
      <button onClick={logoutUser} className="header-button">
        Logout
      </button>
    </div>
  );
};

export default ProfileIcon;
