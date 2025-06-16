import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/OrganizerEventDetails.css";
import NotificationModal from "./NotificationModal";

const OrganizerEventDetails = ({ requestId, onClose }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    console.log("Fetching student list for request ID:", requestId);
    const fetchStudentList = async () => {
      try {
        const res = await api.get(`/event-requests/${requestId}/students`);
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch student list:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentList();
  }, [requestId]);

  if (loading) return <div className="event-details-container">Loading...</div>;

  return (
    <div className="event-details-container">
      <button className="close-btn" onClick={onClose}>✕</button>
      <h2>Registered Students List</h2>

      {students.length === 0 ? (
        <p>No students have registered for this event.</p>
      ) : (
        <div className="students-table-wrapper">
          <table className="students-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.user_id}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="footer-btn">
        <button className="notify-btn" onClick={() => setShowNotificationModal(true)}>
          Send Notification
        </button>
      </div>

      {showNotificationModal && (
        <NotificationModal
          title="Send Notification"
          description={`Sending notification to all ${students.length} registered students.`}
          onClose={() => setShowNotificationModal(false)}
        />
      )}
    </div>
  );
};

export default OrganizerEventDetails;
