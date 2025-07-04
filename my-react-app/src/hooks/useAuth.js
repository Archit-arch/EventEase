// src/hooks/useAuth.js

import { useState, useEffect } from 'react';
import api from '../api/axios'; // make sure this path matches your project structure

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const isAdminPath = window.location.pathname.startsWith('/adminDashboard');

    if (isAdminPath) {
      //Assume admin is authenticated via client certificate
      setUser({ role: 'admin', name: 'Admin' }); // You can customize
      setLoading(false);
      return;
    }
    
    async function fetchUser() {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user); 
        setError(null);
      } catch (err) {
        setUser(null);
        setError('Not authenticated');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, loading, error, setUser };
}

// // src/hooks/useAuth.js

// import { useState, useEffect } from 'react';
// import api from '../api/axios';

// // Shared state across all hooks
// let globalUser = null;
// let globalLoading = true;
// let globalError = null;
// let subscribers = [];

// function notifyAll() {
//   for (const sub of subscribers) {
//     sub({ user: globalUser, loading: globalLoading, error: globalError });
//   }
// }

// async function fetchUserOnce() {
//   globalLoading = true;
//   notifyAll();

//   try {
//     const res = await api.get('/auth/me');
//     globalUser = res.data.user;
//     globalError = null;
//   } catch (err) {
//     globalUser = null;
//     globalError = 'Not authenticated';
//   } finally {
//     globalLoading = false;
//     notifyAll();
//   }
// }

// export function useAuth() {
//   const [auth, setAuth] = useState({
//     user: globalUser,
//     loading: globalLoading,
//     error: globalError,
//   });

//   useEffect(() => {
//     const sub = (newState) => setAuth(newState);
//     subscribers.push(sub);

//     // Fetch only if not already loaded
//     if (!globalUser && globalLoading) {
//       fetchUserOnce(); 
//     }

//     // Set local state immediately to match global
//     setAuth({ user: globalUser, loading: globalLoading, error: globalError });

//     return () => {
//       subscribers = subscribers.filter(s => s !== sub);
//     };
//   }, []);



//   return {
//     ...auth,
//     setUser: (newUser) => {
//       globalUser = newUser;
//       notifyAll();
//     },
//     resetUser: () => {
//       console.log("Resetting user...");
//       globalUser = null;
//       globalError = null;
//       globalLoading = false;
//       notifyAll();
//     },
//   };
// }
