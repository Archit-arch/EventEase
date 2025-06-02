import React from "react";
import { motion } from "framer-motion";
import "./Home.css"; // Optional: for styling
import DarkVariantCarousel from "../components/Caraousel"; // Adjust the path as necessary
import { Card, CardContent, Typography, Grid } from "@mui/material";
import Navbar from '../components/Navbar.jsx';

const Home = () => {
  return (
   
    <div>
       <Navbar />
      {/* Hero Section Animation */}
      <motion.div
        className="hero"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>Welcome to Event-Ease</h1>
        <p>Your campus event management solution at One Place</p>
        <div className="auth-buttons">
          <a href="/login" className="btn btn-primary">Login</a>
          <a href="/register" className="btn btn-secondary">Register</a>
        </div>
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

      <motion.div
        className="features"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Platform Features</h2>
        <Grid container spacing={3} justifyContent="center" padding="0 2rem">
          {[
            { title: "Event Discovery", desc: "Find trending campus events effortlessly." },
            { title: "Easy Booking", desc: "Register for events in just a few clicks." },
            { title: "Real-time Updates", desc: "Stay informed about schedules and changes." },
            { title: "Organizer Dashboard", desc: "Manage events, attendees, and feedback easily." },
          ].map((feature, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card sx={{ height: '100%', textAlign: 'center', boxShadow: 3 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Optional: Add more sections or components as needed */}
    </div>
  );
};

export default Home;
