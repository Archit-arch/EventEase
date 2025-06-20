// AdminSecurityLogsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/SecurityLogs.css';
import api from '../api/axios';
import AdminNavbar from '../components/AdminNavbar';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const SecurityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ type: '', email: '', userId: '', from: '', to: '' });
  const [summary, setSummary] = useState({});


  const [loading, setLoading] = useState(true); // Add loading state
    const { user, loading_auth, error } = useAuth();
    const navigate = useNavigate();
  
    // Handle redirects based on auth state
      useEffect(() => {
        if (!loading) {
          if (!user) {
            console.log("User not authenticated, redirecting to login");
            navigate('/login');
          } else if (user.role !== 'admin') {
            navigate('/unauthorized');
          }
        }
      }, [user, loading_auth, navigate]);


  const fetchLogs = async () => {
    try {
      const res = await api.get('/admin/all-logs', { params: filters });
      setLogs(res.data.logs);
      setSummary(res.data.summary);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  

  return (
    <div className="admin-logs-container">

        <AdminNavbar/>

      <h2>Security Logs</h2>

      <div className="filters">
        <select name="type" onChange={handleChange} value={filters.type}>
        <option value="">All Types</option>
        <option value="LOGIN_SUCCESS">Login Success</option>
        <option value="LOGIN_FAIL">Login Fail</option>
        <option value="REGISTER_SUCCESS">Register Success</option>
        <option value="AUTH_FAIL">Authorization Fail</option>
        <option value="NO_TOKEN">No Token provided</option>
        <option value="TOKEN_INVALID">Invalid Token</option>
        <option value="LOGOUT_USER">Logout User</option>
        <option value="LOGIN_BLOCKED">Login Blocked</option>
        <option value="GLOBAL_RATE_LIMIT_HIT">Global Rate Limit Hit</option>
        <option value="BOOKING_RATE_LIMIT_HIT">Booking Rate Limit Hit</option>
        <option value="LOGIN_DENIED">Login Denied</option>
</select>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="userId" placeholder="User ID" onChange={handleChange} />
        <input type="date" name="from" onChange={handleChange} />
        <input type="date" name="to" onChange={handleChange} />
        <button className = "search-btn" onClick={fetchLogs}>Search</button>
      </div>

      <div className="summary">
        <div className="card green">Login Success: {summary?.LOGIN_SUCCESS || 0}</div>
        <div className="card red">Login Fail: {summary?.LOGIN_FAIL || 0}</div>
        <div className="card orange">Auth Fail: {summary?.AUTH_FAIL || 0}</div>
      </div>

      <table className="logs-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Message</th>
            <th>User Info</th>
            <th>IP & Path</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td className={`tag ${log.type.toLowerCase()}`}>{log.type}</td>
              <td>{log.message}</td>
              <td>
                Email: {log.meta?.email || '-'}<br/>
                ID: {log.meta?.userId || '-'}
              </td>
              <td>
                IP: {log.meta?.ip}<br/>
                Path: {log.meta?.path}
              </td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SecurityLogs;
