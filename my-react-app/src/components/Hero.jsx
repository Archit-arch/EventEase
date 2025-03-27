import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-blue-600 text-white p-12 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to EventEase</h1>
      <p className="text-xl mb-8">Discover and book amazing events with ease.</p>
      <Link 
        to="/events" 
        className="bg-white text-blue-600 font-bold py-2 px-4 rounded hover:bg-gray-200 transition"
      >
        View Events
      </Link>
    </section>
  );
};

export default Hero;
