import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const EventLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/admin/event-logs')
      .then(res => setLogs(res.data))
      .catch(err => console.error('Failed to fetch event logs', err));
  }, []);

  return (
    <div className="mt-4">
      <h5>Admin Event Action Logs</h5>
      <table className="table table-sm table-striped">
        <thead>
          <tr>
            <th>Admin</th>
            <th>Event Name</th>
            <th>Action</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.admin_name}</td>
              <td>{log.event_name}</td>
              <td>{log.status}</td>
              <td>{new Date(log.action_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventLogs;
