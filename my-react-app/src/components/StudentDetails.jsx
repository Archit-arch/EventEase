import React from "react";
import "./StudentDetails.css"; // Import the custom CSS file

const StudentDetails = () => {
  // Mock student info
  const student = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Student",
  };

  return (
    <div className="student-details">
      <h2 className="student-heading">Student Details</h2>
      <p className="student-info"><span className="label">Name:</span> {student.name}</p>
      <p className="student-info"><span className="label">Email:</span> {student.email}</p>
      <p className="student-info"><span className="label">Role:</span> {student.role}</p>
    </div>
  );
};

export default StudentDetails;
