import React from 'react';

function UserModal({ user, onClose }) {
  if (!user) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>User Details</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-field">
            <span className="modal-label">ID:</span>
            <span className="modal-value">{user.id}</span>
          </div>
          <div className="modal-field">
            <span className="modal-label">Username:</span>
            <span className="modal-value">{user.username}</span>
          </div>
          <div className="modal-field">
            <span className="modal-label">Email:</span>
            <span className="modal-value">{user.email}</span>
          </div>
          <div className="modal-field">
            <span className="modal-label">Full Name:</span>
            <span className="modal-value">{user.full_name}</span>
          </div>
        </div>
        {/* <div className="modal-footer">
          <button className="modal-button" onClick={onClose}>Close</button>
        </div> */}
      </div>
    </div>
  );
}

export default UserModal;

