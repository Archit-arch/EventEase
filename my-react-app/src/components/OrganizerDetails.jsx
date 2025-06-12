import React from "react";
import "./StudentDetails.css"; // Or create OrganizerDetails.css
import { FaUserTie } from "react-icons/fa"; // More fitting for organizer
import { motion } from "framer-motion";

const OrganizerDetails = ({ user }) => {
  if (!user) {
    return (
      <motion.div
        className="organizer-details"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <p>Loading user details...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="organizer-details"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2 className="organizer-heading">Organizer Details</h2>
      <FaUserTie size={72} style={{ float: "right" }} />
      <p className="organizer-info">
        <span className="label">Name:</span> {user.name}
      </p>
      <p className="organizer-info">
        <span className="label">Email:</span> {user.email}
      </p>
      <p className="organizer-info">
        <span className="label">Role:</span> {user.role}
      </p>
    </motion.div>
  );
};

export default OrganizerDetails;
