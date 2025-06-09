import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import AdminLogs from './AdminLogs';
import EventLogs from './EventLogs';
import VenueLogs from './VenueLogs';
import UserLogs from './UserLogs';
import { useAuth } from '../hooks/useAuth';

const ViewAdminLogs = () => {
  const { user, loading, error } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('clubs');

  useEffect(() => {
    if (!loading) {
      if (error || !user) {
        // Not authenticated
        navigate('/login');
      } else if (user.role !== 'admin') {
        // Authenticated but unauthorized
        navigate('/unauthorized');
      }
    }
  }, [loading, error, user, navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <AdminNavbar />

      <div className="container mt-5">
        <h2 className="text-center mb-4">Admin Dashboard</h2>
        <div className="d-flex justify-content-center mb-3">
          {['clubs', 'events', 'venues', 'users'].map((tab) => (
            <button
              key={tab}
              className={`btn btn-${activeTab === tab ? 'primary' : 'outline-primary'} mx-2`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Logs
            </button>
          ))}
        </div>

        {activeTab === 'clubs' && <AdminLogs />}
        {activeTab === 'events' && <EventLogs />}
        {activeTab === 'venues' && <VenueLogs />}
        {activeTab === 'users' && <UserLogs />}
      </div>
    </>
  );
};

export default ViewAdminLogs;
