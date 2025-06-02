import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Register Club", path: "/register-club" },
    { name: "Create Event", path: "/create-event" },
    { name: "Club Profile", path: "/club-profile"}
  ];

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
      </div>
    </nav>
  );
};

export default Navbar;