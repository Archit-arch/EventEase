import React from "react";

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
    </div>
  );
};

export default Home;