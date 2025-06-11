import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Profile = () => {
  const { user, loginUser, logoutUser } = useContext(UserContext);
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [preview, setPreview] = useState(user?.avatar || "");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      @media (max-width: 768px) {
        .container {
          flex-direction: column !important;
        }
        .sidebar {
          width: 100% !important;
          border-right: none !important;
          border-bottom: 1px solid #eee !important;
        }
        .main {
          padding: 20px !important;
        }
        .formGrid {
          grid-template-columns: 1fr !important;
        }
        .contactFlex {
          flex-direction: column !important;
          align-items: stretch !important;
        }
      }
    `;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name,
      avatar,
      gender,
      dob,
      nationality,
      maritalStatus,
      city,
      state,
    };
    loginUser(updatedUser);
     Swal.fire({
            icon: "success",
            title: "Profile Updated",
            text: "Your profile has been successfully updated.",
            confirmButtonColor: "#3085d6",
          });
  };

  const calculateProgress = () => {
    let totalFields = 8;
    let filled = 0;
    if (name.trim()) filled++;
    if (avatar) filled++;
    if (gender) filled++;
    if (dob) filled++;
    if (nationality) filled++;
    if (maritalStatus) filled++;
    if (city.trim()) filled++;
    if (state.trim()) filled++;
    return Math.floor((filled / totalFields) * 100);
  };
  const progress = calculateProgress();

  return (
    <div className="container" style={styles.container}>
      {/* Sidebar */}
      <div className="sidebar" style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>MY ACCOUNT</h2>
        <ul style={styles.sidebarList}>
          <li style={styles.active}>
            👤 My Profile <span style={styles.dot}></span>
          </li>
          <li>
            <button onClick={handleLogout} className="header-button" style={{ background: "none", border: "none", color: "#0077ff", cursor: "pointer", fontSize: "15px" }}>
              🚪 Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Section */}
      <div className="main" style={styles.main}>
        <div style={styles.header}>
          <h2 style={styles.title}>My Profile</h2>
          <button style={styles.saveBtn} onClick={handleSave}>SAVE</button>
        </div>

        {/* Progress Section */}
        <div style={styles.alertBox}>
          <div style={styles.progressContainer}>
            <div style={{
              ...styles.progressCircle,
              background: progress === 100 ? "#4caf50" : "#ffcccc"
            }}>
              {progress}%
            </div>
            <div>
              <strong>Complete your profile</strong><br />
              <span>Fill in your personal details to improve your profile status.</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: "100%", background: "#eee", borderRadius: "10px", height: "12px", marginBottom: "20px" }}>
          <div
            style={{
              width: `${progress}%`,
              background: "#4caf50",
              height: "100%",
              borderRadius: "10px",
              transition: "width 0.3s ease-in-out",
            }}
          ></div>
        </div>

        {/* Avatar Upload */}
        <div style={{ marginTop: "2rem" }}>
          <label style={styles.label}>Profile Picture</label>
          <div style={styles.avatarWrapper}>
            <img src={preview || "/default-profile.png"} alt="Avatar" style={styles.avatar} />
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
        </div>

        {/* General Info */}
        <h3 style={styles.sectionTitle}>General Information</h3>
        <div className="formGrid" style={styles.formGrid}>
          <input style={styles.input} placeholder="FIRST & MIDDLE NAME" value={name} onChange={(e) => setName(e.target.value)} />
          <select style={styles.input} value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">GENDER</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input style={styles.input} placeholder="DATE OF BIRTH" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          <select style={styles.input} value={nationality} onChange={(e) => setNationality(e.target.value)}>
            <option value="">NATIONALITY</option>
            <option value="Indian">Indian</option>
            <option value="Other">Other</option>
          </select>
          <select style={styles.input} value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}>
            <option value="">MARITAL STATUS</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
          </select>
          <input style={styles.input} placeholder="CITY OF RESIDENCE" value={city} onChange={(e) => setCity(e.target.value)} />
          <input style={styles.input} placeholder="STATE" value={state} onChange={(e) => setState(e.target.value)} />
        </div>

        {/* Contact */}
        <div style={styles.contactContainer}>
          <h3 style={styles.sectionTitle}>Contact Details</h3>
          <p style={styles.contactNote}>Add contact information to receive booking details & other alerts</p>
          <div className="contactFlex" style={styles.contactFlex}>
            <button style={styles.mobileBtn}>ADD MOBILE NUMBER</button>
            <div style={styles.emailBox}>
              <span style={styles.emailLabel}>EMAIL ID</span><br />
              <span style={styles.emailValue}>{user?.email || "Not Provided"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Styles
const styles = {
  container: {
    display: "flex",
    fontFamily: "sans-serif",
    background: "#f9f9f9",
    minHeight: "100vh",
  },
  sidebar: {
    width: "220px",
    padding: "20px",
    background: "#fff",
    borderRight: "1px solid #eee",
  },
  sidebarTitle: {
    fontSize: "14px",
    color: "#999",
    marginBottom: "16px",
  },
  sidebarList: {
    listStyle: "none",
    padding: 0,
    fontSize: "15px",
    fontWeight: 500,
    lineHeight: "2.2",
    color: "#333",
  },
  active: {
    background: "#e6f0ff",
    borderRadius: "8px",
    padding: "8px",
    position: "relative",
  },
  dot: {
    background: "red",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    display: "inline-block",
    position: "absolute",
    right: "12px",
    top: "12px",
  },
  main: {
    flex: 1,
    padding: "30px",
    background: "#fff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
  },
  saveBtn: {
    padding: "10px 20px",
    background: "#e0e0e0",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  alertBox: {
    background: "linear-gradient(to right, #fde2e2, #fff6d3)",
    padding: "16px",
    borderRadius: "10px",
    marginBottom: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressContainer: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  progressCircle: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    color: "#000",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: 600,
    margin: "20px 0 10px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  label: {
    fontWeight: 600,
    marginBottom: "6px",
    display: "block",
  },
  avatarWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginTop: "10px",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #3b82f6",
    boxShadow: "0 0 8px rgba(0,0,0,0.15)",
  },
  contactContainer: {
    marginTop: "2rem",
    marginBottom: "2rem",
  },
  contactNote: {
    color: "#666",
    fontSize: "14px",
    marginBottom: "10px",
  },
  contactFlex: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    alignItems: "center",
  },
  mobileBtn: {
    padding: "12px 16px",
    backgroundColor: "#e6f0ff",
    border: "1px solid #0077ff",
    color: "#0077ff",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    minWidth: "200px",
    textAlign: "center",
  },
  emailBox: {
    backgroundColor: "#f5f5f5",
    padding: "10px 16px",
    borderRadius: "8px",
    flexGrow: 1,
    minWidth: "240px",
  },
  emailLabel: {
    fontSize: "12px",
    color: "#888",
    textTransform: "uppercase",
  },
  emailValue: {
    fontWeight: "bold",
    color: "#000",
    fontSize: "17px",
  },
};

export default Profile;
