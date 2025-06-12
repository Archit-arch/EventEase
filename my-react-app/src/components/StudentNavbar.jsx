import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import "../styles/StudentNavbar.css";
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, loading, error } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "Dashboard", path: "/studentDashboard" },
  ];
  
  const guestLinks = [
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
  ];

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log("User not authenticated, redirecting to login");
        navigate('/login');
      } else if (user.role !== 'student') {
        navigate('/unauthorized');
      }
    }
  }, [user, loading, navigate]);

  // Hide dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    }
    if (showUserDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserDropdown]);

  // Close mobile menu when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await api.get('/auth/logout'); // GET /logout withCredentials already set in api instance
      navigate('/login'); // Redirect to login page
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="logo">
          EventEase
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links desktop-only">
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
          {!user && guestLinks.map((link) => (
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
        </div>

        {/* Desktop User Section */}
        {user && (
          <div className="user-section desktop-only" ref={dropdownRef}>
            <button
              className="user-button"
              onClick={() => setShowUserDropdown((prev) => !prev)}
            >
              <FiUser size={22} style={{ marginRight: "6px" }} />
              <span className="user-name">{user.name || user.username || "Student"}</span>
            </button>
            {showUserDropdown && (
              <div className="user-dropdown">
                <div className="user-info">
                  <div><strong>Name:</strong> {user.name || user.username}</div>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Role:</strong> {user.role}</div>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                  <FiLogOut style={{ marginRight: "6px" }} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button 
          className="menu-button mobile-only"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? "active" : ""}`}>
        {/* Mobile User Info (if logged in) */}
        {user && (
          <div className="mobile-user-info">
            <div className="mobile-user-header">
              <FiUser size={20} />
              <span>{user.name || user.username || "Student"}</span>
            </div>
            <div className="mobile-user-details">
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Role:</strong> {user.role}</div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Links */}
        <div className="mobile-nav-links">
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
          {!user && guestLinks.map((link) => (
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
        </div>

        {/* Mobile Logout Button */}
        {user && (
          <button className="logout-btn mobile" onClick={handleLogout}>
            <FiLogOut style={{ marginRight: "6px" }} />
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
