// components/Profile.jsx
import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, loginUser } = useContext(UserContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [preview, setPreview] = useState(user?.avatar || "");
  const navigate = useNavigate();

  if (!user) {
    navigate("/login"); // 🔐 protect route
    return null;
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result); // Show preview
      setAvatar(reader.result); // Save base64
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const updatedUser = { ...user, name, email, avatar };
      loginUser(updatedUser); // Save to context & localStorage

      // Optional: send to backend
      /*
      await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name, email, avatar }),
      });
      */

      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to save changes.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Profile Settings</h2>

      <div className="flex flex-col items-center mb-4">
        <img
          src={preview || "/default-profile.png"}
          alt="Avatar"
          className="w-24 h-24 rounded-full border mb-2 object-cover"
        />
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
};

export default Profile;
