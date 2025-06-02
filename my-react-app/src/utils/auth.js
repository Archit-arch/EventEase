// src/utils/auth.js
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  const base64Payload = token.split('.')[1];
  const payload = atob(base64Payload);
  return JSON.parse(payload);
};
