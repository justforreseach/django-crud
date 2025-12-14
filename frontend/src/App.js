import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import UserModal from './components/UserModal';
import './App.css';

const API_BASE_URL = 'http://localhost:8000/api';

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  const handleAddUser = async (userData) => {
    try {
      console.log('Sending POST request to:', `${API_BASE_URL}/users/`);
      console.log('Payload:', userData);
      const response = await axios.post(`${API_BASE_URL}/users/`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response:', response.data);
      console.log('Response status:', response.status);
      await fetchUsers();
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      
      if (error.response) {
        let errorMsg = '';
        if (error.response.data?.username) {
          errorMsg = Array.isArray(error.response.data.username) 
            ? error.response.data.username[0] 
            : error.response.data.username;
        } else if (error.response.data?.email) {
          errorMsg = Array.isArray(error.response.data.email) 
            ? error.response.data.email[0] 
            : error.response.data.email;
        } else {
          errorMsg = error.response.data?.detail || 
                    error.response.data?.error ||
                    JSON.stringify(error.response.data);
        }
        console.error('Error adding user: ' + errorMsg);
      } else if (error.request) {
        console.error('No response received. Request:', error.request);
        console.error('Error adding user: Network Error. Make sure Django server is running on http://localhost:8000');
      } else {
        console.error('Error adding user: ' + error.message);
      }
    }
  };

  const handleUpdateUser = async (id, userData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${id}/`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      console.error('Error response:', error.response?.data);
      let errorMsg = '';
      if (error.response?.data?.username) {
        errorMsg = Array.isArray(error.response.data.username) 
          ? error.response.data.username[0] 
          : error.response.data.username;
      } else if (error.response?.data?.email) {
        errorMsg = Array.isArray(error.response.data.email) 
          ? error.response.data.email[0] 
          : error.response.data.email;
      } else {
        errorMsg = error.response?.data?.detail || error.message;
      }
      console.error('Error updating user: ' + errorMsg);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_BASE_URL}/users/${id}/`);
        await fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        console.error('Error deleting user: ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  const handleViewUser = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${id}/`);
      setViewingUser(response.data);
    } catch (error) {
      console.error('Error viewing user:', error);
      console.error('Error viewing user: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleCloseModal = () => {
    setViewingUser(null);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  return (
    <div className="container">
      <h1>User Management</h1>
      <UserForm
        onSubmit={editingUser ? (data) => handleUpdateUser(editingUser.id, data) : handleAddUser}
        editingUser={editingUser}
        onCancel={handleCancelEdit}
      />
      <UserList
        users={users}
        onEdit={handleEditClick}
        onDelete={handleDeleteUser}
        onView={handleViewUser}
      />
      <UserModal
        user={viewingUser}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;

