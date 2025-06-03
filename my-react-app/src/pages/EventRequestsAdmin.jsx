import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const EventRequestsAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/admin/event-requests');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching event requests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    const url = `/admin/event-requests/${id}/${action}`;
    let body = {};

    if (action === 'reject') {
      const reason = prompt("Enter rejection reason:");
      if (!reason) return;
      body = { reason };
    }

    try {
      await api.put(url, body);
      fetchRequests(); // refresh after action
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Failed"));
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {requests.length === 0 ? (
        <p>No event requests found.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Venue ID</th>
              <th>Club ID</th>
              <th>Created By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td>{req.title}</td>
                <td>{req.description}</td>
                <td>{req.date}</td>
                <td>{req.start_time}</td>
                <td>{req.end_time}</td>
                <td>{req.venue_id}</td>
                <td>{req.club_id}</td>
                <td>{req.created_by}</td>
                <td>{req.status}</td>
                <td>
                  {req.status === 'pending' ? (
                    <>
                      <button className="btn btn-success btn-sm me-2" onClick={() => handleAction(req.id, 'approve')}>Approve</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleAction(req.id, 'reject')}>Reject</button>
                    </>
                  ) : req.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EventRequestsAdmin;
