import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth} from '../hooks/useAuth';
import { Link, NavLink, useNavigate } from "react-router-dom";
import api from '../api/axios';
import '../styles/Navbar.css'; // Import your CSS styles

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, error } = useAuth();
  const navigate = useNavigate();

 const handleLogout = () => {
  navigate('/'); // Redirect to home page, no API call needed
};


  const navLinks = [
  { name: "Admin Logs", path: "/adminDashboard/view-admin-logs" },
  { name: "Approve/Reject Requests", path: "/adminDashboard/view-requests" },
  { name: "Security-Logs", path: "/adminDashboard/security-logs" },
  { name: "User Management", path: "/adminDashboard/user-management" }, // ✅ fixed slash
];

/*
  useEffect(() => {
        if (!loading) {
          if (!user) {
            console.log("User not authenticated, redirecting to login, in AdminNavbar");
            navigate('/login');
          } else if (user.role !== 'admin') {
            navigate('/unauthorized');
          }
        }
      }, [user, loading, navigate]);
*/
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

export default AdminNavbar;