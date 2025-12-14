import React from 'react';

function UserList({ users, onEdit, onDelete, onView }) {
  return (
    <div>
      <h2>Users List</h2>
      {users.length === 0 ? (
        <p className="empty-message">No users found. Add a user to get started.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Full Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.full_name}</td>
                  <td>
                    <button
                      className="action-button view-button"
                      onClick={() => onView(user.id)}
                    >
                      View
                    </button>
                    <button
                      className="action-button edit-button"
                      onClick={() => onEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={() => onDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserList;

