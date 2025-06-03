import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const VenueRequestsAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/admin/venue-requests');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching venue requests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    const url = `/admin/venue-requests/${id}/${action}`;
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
        <p>No venue requests found.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Created By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td>{req.name}</td>
                <td>{req.location}</td>
                <td>{req.capacity}</td>
                <td>{req.created_by}</td>
                <td>{req.status}</td>
                <td>
                  {req.status === 'Pending' ? (
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

export default VenueRequestsAdmin;
