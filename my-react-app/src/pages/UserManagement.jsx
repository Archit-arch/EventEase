import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import AdminNavbar from '../components/AdminNavbar';

const UserManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [filterRole, setFilterRole] = useState('student');
  const [filterRole, setFilterRole] = useState(null); // Default: show all roles

  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/admin/all-users');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    const url = `/admin/users/${id}/${action}`;
    let body = {};

    if (action === 'suspend-user' || action === 'reactivate-user') {
      const reason = prompt("Enter reason:");
      if (!reason) return;
      body = { reason };
    }

    try {
      await api.put(url, body);
      fetchRequests(); // refresh after action
      setSearchResult(null); // reset search result
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Failed"));
    }
  };

  const handleSearch = () => {
    if (!searchId.trim()) return setSearchResult(null);
    const user = requests.find((u) => String(u.user_id) === searchId.trim());
    setSearchResult(user || null);
  };

  useEffect(() => {
    fetchRequests();
  }, []);


  const filteredRequests = filterRole
  ? requests.filter((req) => req.role?.toLowerCase() === filterRole.toLowerCase())
  : requests;


  if (loading) return <p>Loading...</p>;

  const displayUsers = searchResult ? [searchResult] : filteredRequests;

  return (
    <div>
      <AdminNavbar />

      {/* Filter section */}
      <div className="mb-3 d-flex align-items-center gap-3">
        <div>
          <label htmlFor="roleFilter" className="form-label fw-bold">Select Role:</label>
                    <select
  id="roleFilter"
  className="form-select w-auto d-inline ms-2"
  value={filterRole || ''}
  onChange={(e) => setFilterRole(e.target.value || null)}
>
  <option value="">All</option>
  <option value="student">Student</option>
  <option value="organizer">Organiser</option>
</select>
        </div>



        {/* Search by ID */}
        <div>
          <label className="form-label fw-bold me-2">Search by User ID:</label>
          <input
            type="text"
            className="form-control d-inline w-auto"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button className="btn btn-primary btn-sm ms-2" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {displayUsers.length === 0 ? (
        <p>No users found{searchId ? ' with that ID.' : ' for the selected role.'}</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayUsers.map((req) => (
              <tr key={req.user_id}>
                <td>{req.user_id}</td>
                <td>{req.name}</td>
                <td>{req.email}</td>
                <td>{req.role}</td>
                <td>{req.created_at}</td>
                <td>{req.is_active ? 'Active' : 'Suspended'}</td>
                <td>
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleAction(req.user_id, 'reactivate-user')}
                    >
                      Reactivate
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleAction(req.user_id, 'suspend-user')}
                    >
                      Suspend
                    </button>
                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;
