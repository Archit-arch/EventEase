import React from "react";
import "./StudentDetails.css"; // Import the custom CSS file
import { PiStudentFill } from "react-icons/pi";
import { motion } from "framer-motion";

const StudentDetails = () => {
  const student = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Student",
  };

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
        <span className="label">Name:</span> {student.name}
      </p>
      <p className="student-info">
        <span className="label">Email:</span> {student.email}
      </p>
      <p className="student-info">
        <span className="label">Role:</span> {student.role}
      </p>
    </motion.div>
  );
};

export default StudentDetails;
