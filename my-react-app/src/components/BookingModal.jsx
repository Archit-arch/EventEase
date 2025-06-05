import React from "react";
import "../styles/BookingModal.css"; // Make sure to create this CSS file or copy the styles below

const BookingModal = ({ show, success, message, onOk }) => {
  if (!show) return null;

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal">
        <div className={`modal-icon ${success ? "success" : "fail"}`}>
          {success ? "🎉" : "❌"}
        </div>
        <div className="modal-message">{message}</div>
        <button className="modal-ok-btn" onClick={onOk}>OK</button>
      </div>
    </div>
  );
};

export default BookingModal;
