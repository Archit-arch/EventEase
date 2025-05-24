import React from "react";
import { motion } from "framer-motion";
import "./Home.css"; // Optional: for styling
import DarkVariantCarousel from "../components/Caraousel"; // Adjust the path as necessary
import Footer from '../components/Footer/Footer.jsx';


const Home = () => {
  return (
    <div>
      {/* Hero Section Animation */}
      <motion.div
        className="hero"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>Welcome to EventEase</h1>
        <p>Your campus event management solution</p>
        <a href="/events" className="btn btn-primary">
          Browse Events
        </a>
      </motion.div>

      {/* Carousel Section */}
      <motion.div
        className="carousel-container"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <DarkVariantCarousel />
      </motion.div>

      {/* Features Section Animation */}
      <motion.div
        className="features"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2>Features</h2>
        {/* Add animated feature components here if needed */}
      </motion.div>

      {/* Footer Section */}
      <Footer />

      {/* Optional: Add more sections or components as needed */}
    </div>
  );
};

export default Home;
