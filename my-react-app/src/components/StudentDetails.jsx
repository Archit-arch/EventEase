import React from "react";
import "./StudentDetails.css"; // Custom CSS file
import { PiStudentFill } from "react-icons/pi";
import { motion } from "framer-motion";

const StudentDetails = ({ user }) => {
  if (!user) {
    return (
      <motion.div
        className="student-details"
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
      className="student-details"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2 className="student-heading">Student Details</h2>
      <PiStudentFill size={72} style={{ float: "right" }} />
      <p className="student-info">
        <span className="label">Name:</span> {user.name}
      </p>
      <p className="student-info">
        <span className="label">Email:</span> {user.email}
      </p>
      <p className="student-info">
        <span className="label">Role:</span> {user.role}
      </p>
    </motion.div>
  );
};

export default StudentDetails;
// This component displays student details with a fade-in animation using Framer Motion.