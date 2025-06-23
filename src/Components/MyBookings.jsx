import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const MyBookings = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyBookings = async () => {
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
    };

    fetchMyBookings();
  }, [user, navigate]); // Re-run when user context changes

  if (loading) {
    return <div style={styles.loading}>Loading your bookings...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Bookings</h2>
      {bookings.length === 0 ? (
        <p style={styles.noBookings}>You have no bookings yet. Time to plan a trip!</p>
      ) : (
        <div style={styles.bookingsGrid}>
          {bookings.map((booking) => (
            <div key={booking._id} style={styles.bookingCard}>
              <p style={styles.cardDetail}><strong>From:</strong> {booking.from}</p>
              <p style={styles.cardDetail}><strong>To:</strong> {booking.to}</p>
              <p style={styles.cardDetail}><strong>Guests:</strong> {booking.guests}</p>
              <p style={styles.cardDetail}><strong>Arrival:</strong> {new Date(booking.arrival).toLocaleDateString()}</p>
              <p style={styles.cardDetail}><strong>Leaving:</strong> {new Date(booking.leaving).toLocaleDateString()}</p>
              <p style={styles.cardDetailSmall}>Booked On: {new Date(booking.createdAt).toLocaleDateString()} {new Date(booking.createdAt).toLocaleTimeString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    maxWidth: '900px',
    margin: '40px auto',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    fontFamily: 'sans-serif',
  },
  heading: {
    textAlign: 'center',
    fontSize: '3.5rem',
    marginBottom: '30px',
    color: '#333',
    fontWeight: '700',
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
    backgroundColor: '#f9f9f9',
    border: '1px solid #eee',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  },
  cardDetail: {
    margin: '8px 0',
    fontSize: '15px',
    color: '#444',
    fontWeight: '500',
  },
  cardDetailSmall: {
    fontSize: '1.30rem',
    color: '#999',
    marginTop: '15px',
    borderTop: '1px solid #eee',
    paddingTop: '10px',
  },
};

export default MyBookings;