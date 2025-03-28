import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      <div className="hero">
        <h1>Welcome to EventEase</h1>
        <p>Your campus event management solution</p>
        <a href="/events" className="btn btn-primary">
          Browse Events
        </a>
      </div>

      <div className="features">
        <h2>Features</h2>
        {/* Add feature components */}
      </div>

      <Footer />
    </div>
  );
};

export default Home;