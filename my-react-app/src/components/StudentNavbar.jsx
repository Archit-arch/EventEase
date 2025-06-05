import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import "../styles/StudentNavbar.css"; // Import the CSS file for student-specific styles

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Only show Login/Register if not logged in
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "Dashboard", path: "/studentDashboard" },
    // Add more links as needed
  ];
  const guestLinks = [
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
  ];

  // Get user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setShowUserDropdown(false);
    navigate("/login");
  };

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
          {/* Only show Login/Register if NOT logged in */}
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

        {/* User Icon and Name */}
        {user && (
          <div className="user-section" ref={dropdownRef}>
            <button
              className="user-button"
              onClick={() => setShowUserDropdown((prev) => !prev)}
            >
              <FiUser size={22} style={{ marginRight: "6px" }} />
              <span className="user-name">{user.name || user.username || "Student"}</span>
            </button>
            {showUserDropdown && (
              <div className="user-dropdown">
                <div><strong>Name:</strong> {user.name || user.username}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Role:</strong> {user.role}</div>
                <button className="logout-btn" onClick={handleLogout}>
                  <FiLogOut style={{ marginRight: "6px" }} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

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
        {/* Only show Login/Register if NOT logged in */}
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
        {/* Show logout in mobile menu if logged in */}
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
