import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const UserLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    api.get('/admin/get-user-logs')
      .then(res => setLogs(res.data))
      .catch(err => console.error('Failed to fetch user logs', err));
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filterRole !== 'all' && log.role.toLowerCase() !== filterRole.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="mt-4 container">
      <h5 className="mb-3">Admin User Action Logs</h5>

      {/* Role Filter */}
      <div className="mb-3">
        <label className="fw-bold me-2">Filter by Role:</label>
        <select
          className="form-select form-select-sm d-inline w-auto"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">All</option>
          <option value="student">Student</option>
          <option value="organizer">Organizer</option>
        </select>
      </div>

      {/* Logs Table */}
      <table className="table table-sm table-striped">
        <thead>
          <tr>
            <th>User Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Reason</th>
            <th>Action Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.length > 0 ? (
            filteredLogs.map(log => (
              <tr key={log.id}>
                <td>{log.user_id}</td>
                <td>{log.name}</td>
                <td>{log.email}</td>
                <td>{log.role}</td>
                <td>{log.status}</td>
                <td>{log.description}</td>
                <td>{new Date(log.approved_at || log.action_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted">
                No logs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserLogs;
