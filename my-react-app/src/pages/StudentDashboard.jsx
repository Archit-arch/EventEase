import React, { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import StudentDetails from "../components/StudentDetails";
import StudentNavbar from "../components/StudentNavbar";
import "../styles/StudentDashboard.css";
import Footer from '../components/Footer/Footer.jsx';
import { useNavigate } from "react-router-dom";
import api from '../api/axios'; 

const StudentDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("upcoming");
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState('');
  const navigate = useNavigate();
  
useEffect(() => {
  const storedUser = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  console.log('Stored User:', storedUser);
  console.log('Stored Token:', token);

  if (!storedUser || !token) {
    console.log('Redirecting to login due to missing user/token');
    navigate('/login');
    return;
  }

  const parsedUser = JSON.parse(storedUser);

  if (parsedUser.role !== 'student') {
    navigate('/unauthorized');
    return;
  }

  setUser(parsedUser); // Valid student user

  // Optional: Verify token with backend
  api.get('/auth/studentDashboard')
    .then(res => {
      console.log("✔️ Dashboard access OK:", res.data);
    })
    .catch(err => {
      console.error("❌ Token invalid or expired:", err.response?.data || err.message);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login'); // Redirect only if API fails
    });
}, [navigate]);


  // Currently using mockEvents (optional: later fetch real ones)
  useEffect(() => {
    import('../utils/mockEvents').then(module => {
      setBookings(module.mockEvents || []);
    });
  }, []);

  const filteredBookings = bookings.filter(b =>
    filter === "upcoming" ? !b.isCompleted : b.isCompleted
  );

  return (
    <div className="dashboard-container">
      <StudentNavbar />
      <div className="dashboard-content">
        {/* Left: Events */}
        <div className="dashboard-left">
          <div className="dashboard-header">
            <h1>My Bookings</h1>
            <p>{greeting}</p>
            <div className="filter-buttons">
              <button
                className={filter === "upcoming" ? "active" : ""}
                onClick={() => setFilter("upcoming")}
              >
                Upcoming Events
              </button>
              <button
                className={filter === "past" ? "active" : ""}
                onClick={() => setFilter("past")}
              >
                Past Events
              </button>
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <p>No {filter === "upcoming" ? "upcoming" : "past"} events found.</p>
          ) : (
            <div className="event-grid">
              {filteredBookings.map(booking => (
                <EventCard key={booking.id} event={booking} />
              ))}
            </div>
          )}
        </div>

        {/* Right: Student Details */}
        <div className="dashboard-right">
          <StudentDetails user={user} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
