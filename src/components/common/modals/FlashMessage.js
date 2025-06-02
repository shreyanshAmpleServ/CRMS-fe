import React, { useState, useEffect } from "react";
import './Flashmessage.css';
const FlashMessage = ({ type = "success", message, onClose, duration = 5000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [duration, onClose]);

  if (!visible || !message) return null;

  const messageClass =
    type === "success" ? "alert alert-success" : "alert alert-danger";

  return (
    <div className={`${messageClass} d-flex align-items-center`} role="alert">
      <span className="me-auto">{message}</span>
      <button
        type="button"
        className="btn-close closeBtn"
        aria-label="Close"
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
      ></button>
    </div>
  );
};

export default FlashMessage;
