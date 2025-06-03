import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/admin/logs')
      .then(res => setLogs(res.data))
      .catch(err => console.error('Failed to fetch logs', err));
  }, []);

  return (
    <div className="mt-4">
      <h5>Admin Action Logs</h5>
      <table className="table table-sm table-striped">
        <thead>
          <tr>
            <th>Admin</th>
            <th>Club Name</th>
            <th>Action</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.admin_name}</td>
              <td>{log.club_name}</td>
              <td>{log.status}</td>
              <td>{new Date(log.approved_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminLogs;
