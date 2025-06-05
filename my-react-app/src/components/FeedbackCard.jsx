import React from "react";
import "../styles/FeedbackCard.css";

const FeedbackCard = ({ feedback }) => (
  <div className="feedback-card">
    <div className="feedback-stars">
      {"★".repeat(feedback.ratings)}
      {"☆".repeat(5 - feedback.ratings)}
    </div>
    <div className="feedback-text">
      {feedback.comments || <span className="feedback-placeholder">No comment provided.</span>}
    </div>
    <div className="feedback-user-row">
      <img
        src="/images/defaultposter.png" // Use your default icon path here
        alt="User avatar"
        className="feedback-avatar"
      />
      <div className="feedback-user-details">
        <div className="feedback-user-name">{feedback.user_name || "Anonymous"}</div>
        <div className="feedback-user-role">Student</div>
      </div>
    </div>
  </div>
);

export default FeedbackCard;
