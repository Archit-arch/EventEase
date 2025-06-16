import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate} from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from '../hooks/useAuth';
import '../styles/Navbar.css'; // Import your CSS styles
import api from '../api/axios';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, error} = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.get('/auth/logout'); // GET /logout withCredentials already set in api instance
      navigate('/login'); // Redirect to login page
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navLinks = [
    { name: "Dashboard", path: "/eventManager" },
    { name: "Register Club", path: "/register-club" },
    { name: "Request Event", path: "/create-event" },
    { name: "Request Venue", path: "/venue-requests" },
  ];

  useEffect(() => {
        if (!loading) {
          if (!user) {
            console.log("User not authenticated, redirecting to login");
            navigate('/login');
          } else if (user.role !== 'organizer') {
            navigate('/unauthorized');
          }
        }
      }, [user, loading, navigate]);

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="logo">
          EventEase
        </Link>

        <div className="nav-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              {link.name}
            </NavLink>
          ))}
                     <button onClick={handleLogout} className="logout-btn">Logout</button>

        </div>

        <button 
          className="menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <div className={`mobile-menu ${isMenuOpen ? "active" : ""}`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => 
              `nav-link ${isActive ? "active" : ""}`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            {link.name}
          </NavLink>
        ))}
                   <button onClick={handleLogout} className="logout-btn">Logout</button>

      </div>
    </nav>
  );
};

export default Navbar;