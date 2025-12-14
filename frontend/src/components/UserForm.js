import React, { useState, useEffect } from 'react';

function UserForm({ onSubmit, editingUser, onCancel }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: ''
  });

  useEffect(() => {
    if (editingUser) {
      setFormData({
        username: editingUser.username,
        email: editingUser.email,
        full_name: editingUser.full_name
      });
    } else {
      setFormData({
        username: '',
        email: '',
        full_name: ''
      });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!editingUser) {
      setFormData({
        username: '',
        email: '',
        full_name: ''
      });
    }
  };

  return (
    <div className="form-container">
      <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit">
            {editingUser ? 'Update User' : 'Add User'}
          </button>
          {editingUser && (
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default UserForm;

