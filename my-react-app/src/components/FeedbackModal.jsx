import React, { useState } from "react";
import "../styles/FeedbackModal.css";

const StarRating = ({ value, onChange }) => (
  <div className="star-rating">
    {[1,2,3,4,5].map(star => (
      <span
        key={star}
        className={star <= value ? "star filled" : "star"}
        onClick={() => onChange(star)}
        role="button"
        tabIndex={0}
      >★</span>
    ))}
  </div>
);

const FeedbackModal = ({ show, onClose, onSubmit, loading }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  if (!show) return null;

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal">
        <h2>Submit Feedback</h2>
        <div>
          <label>Rating:</label>
          <StarRating value={rating} onChange={setRating} />
        </div>
        <div>
          <label>Comment (optional):</label>
          <textarea
            placeholder="Share your experience..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            maxLength={500}
          />
        </div>
        <div className="feedback-modal-actions">
          <button className="modal-ok-btn" onClick={() => onSubmit(rating, comment)} disabled={loading || rating === 0}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button className="modal-cancel-btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
