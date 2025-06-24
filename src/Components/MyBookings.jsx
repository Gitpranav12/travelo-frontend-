import React, { useState, useEffect, useContext, useCallback } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Helper function to format date to DD/MM/YY
const formatDateToDDMMYY = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = String(date.getFullYear()).slice(2); // Get last two digits of the year
  return `${day}/${month}/${year}`;
};

const MyBookings = () => {
  const { user, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'current'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          margin: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
        }
        .bookingsGrid {
            grid-template-columns: 1fr !important;
        }
        .filterButtons {
            flex-direction: column;
            gap: 10px;
        }
        .actionButtons {
            flex-direction: column;
            gap: 8px;
            margin-top: 15px;
        }
      }
    `;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  const fetchMyBookings = useCallback(async () => {
    if (!user || !localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/bookings/mybookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setBookings(data.data);
      } else {
        setError(data.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Network error. Could not fetch bookings.');
    } finally {
      setLoading(false);
    }
  }, [user, navigate, setLoading, setError, setBookings]);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  // Effect to filter bookings whenever 'bookings' or 'activeFilter' changes
  useEffect(() => {
    const filterBookings = () => {
      const now = new Date();
      switch (activeFilter) {
        case 'current':
          setFilteredBookings(
            bookings.filter(booking => {
              const arrivalDate = new Date(booking.arrival);
              const leavingDate = new Date(booking.leaving);
              return arrivalDate <= now && leavingDate >= now;
            })
          );
          break;
        case 'all':
        default:
          setFilteredBookings(bookings);
          break;
      }
    };
    filterBookings();
  }, [bookings, activeFilter]);


  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleDeleteBooking = async (bookingId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            Swal.fire(
              'Deleted!',
              'Your booking has been deleted.',
              'success'
            );
            // Refresh bookings after deletion
            fetchMyBookings();
          } else {
            const data = await response.json();
            Swal.fire(
              'Failed!',
              data.message || 'Failed to delete booking.',
              'error'
            );
          }
        } catch (err) {
          console.error('Error deleting booking:', err);
          Swal.fire(
            'Error!',
            'Network error. Could not delete booking.',
            'error'
          );
        }
      }
    });
  };

  return (
    <div className="container" style={styles.container}>
      {/* Sidebar */}
      <div className="sidebar" style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>MY ACCOUNT</h2>
        <ul style={styles.sidebarList}>
          <li>
            <Link to="/profile" style={{ textDecoration: 'none', color: '#090040' }}>
              👤 My Profile
            </Link>
          </li>
          <li style={styles.active}>
            ✈️ My Bookings <span style={styles.dot}></span>
          </li>
          <li>
            <Link to="/forgotpassword" style={{ textDecoration: 'none', color: '#090040' }}>
              🔐 Reset Password
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="header-button" style={{ background: "none", border: "none", color: "#0077ff", cursor: "pointer", fontSize: "15px" }}>
              🚪 Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Section for My Bookings */}
      <div className="main" style={styles.main}>
        <div style={styles.header}>
          <h2 style={styles.title}>My Bookings</h2>
          <div style={styles.filterButtons}>
            <button
              style={activeFilter === 'all' ? styles.filterButtonActive : styles.filterButton}
              onClick={() => setActiveFilter('all')}
            >
              All Bookings
            </button>
            <button
              style={activeFilter === 'current' ? styles.filterButtonActive : styles.filterButton}
              onClick={() => setActiveFilter('current')}
            >
              Current Bookings
            </button>
          </div>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading your bookings...</div>
        ) : error ? (
          <div style={styles.error}>Error: {error}</div>
        ) : filteredBookings.length === 0 ? (
          <p style={styles.noBookings}>No {activeFilter} bookings found.</p>
        ) : (
          <div style={styles.bookingsGrid}>
            {filteredBookings.map((booking) => (
              <div key={booking._id} style={styles.bookingCard}>
                <p style={styles.cardDetail}><strong>From:</strong> {booking.from}</p>
                <p style={styles.cardDetail}><strong>To:</strong> {booking.to}</p>
                <p style={styles.cardDetail}><strong>Guests:</strong> {booking.guests}</p>
                <p style={styles.cardDetail}><strong>Arrival:</strong> {formatDateToDDMMYY(booking.arrival)}</p> {/* Changed format */}
                <p style={styles.cardDetail}><strong>Leaving:</strong> {formatDateToDDMMYY(booking.leaving)}</p> {/* Changed format */}
                <p style={styles.cardDetailSmall}>Booked On: {formatDateToDDMMYY(booking.createdAt)} {new Date(booking.createdAt).toLocaleTimeString()}</p> {/* Changed format */}
                <div style={styles.actionButtons}>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDeleteBooking(booking._id)}
                  >
                    Delete Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Internal Styles (unchanged from previous version)
const styles = {
  container: {
    display: "flex",
    fontFamily: "sans-serif",
    background: "#f0f2f5", // Light gray/blue for the overall background
    minHeight: "100vh",
  },
  sidebar: {
    width: "220px",
    padding: "20px",
    background: "#ffffff",
    borderRight: "1px solid #eee",
    boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
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
    background: "#f9f9fb",
    borderRadius: "8px",
    margin: "20px",
    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "15px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
  },
  filterButtons: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  filterButton: {
    padding: "10px 18px",
    border: "1px solid #ccc",
    borderRadius: "20px",
    backgroundColor: "#fff",
    color: "#555",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    '&:hover': {
      backgroundColor: '#f0f0f0',
      borderColor: '#aaa',
    },
  },
  filterButtonActive: {
    padding: "10px 18px",
    border: "1px solid #007bff",
    borderRadius: "20px",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0 2px 5px rgba(0,123,255,0.2)",
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    padding: '50px',
    color: '#555',
  },
  error: {
    textAlign: 'center',
    fontSize: '1.2rem',
    padding: '50px',
    color: '#d9534f',
    backgroundColor: '#fbe9e7',
    borderRadius: '8px',
  },
  noBookings: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#777',
    padding: '20px',
    border: '1px dashed #ccc',
    borderRadius: '8px',
  },
  bookingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '25px',
  },
  bookingCard: {
    backgroundColor: "#ffffff",
    border: '1px solid #eee',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardDetail: {
    margin: '8px 0',
    fontSize: '15px',
    color: '#444',
    fontWeight: '500',
  },
  cardDetailSmall: {
    fontSize: '0.9rem', // Reverted to 0.9rem for general text, 1.5rem was very large
    color: '#999',
    marginTop: '15px',
    borderTop: '1px solid #eee',
    paddingTop: '10px',
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  deleteButton: {
    padding: '8px 15px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#c82333',
    },
  },
};

export default MyBookings;