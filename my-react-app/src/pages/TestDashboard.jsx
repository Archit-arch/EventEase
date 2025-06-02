import React from 'react';

function TestDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  return (
    <div>
      <h1>Test Dashboard</h1>
      <pre>User: {JSON.stringify(user, null, 2)}</pre>
      <p>Token: {token}</p>
    </div>
  );
}

export default TestDashboard;
