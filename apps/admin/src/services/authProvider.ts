import { AuthProvider } from 'react-admin';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const authProvider: AuthProvider = {
  login: ({ username, password }) => {
    const request = new Request(`${API_URL}/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: username, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    
    return fetch(request)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(auth => {
        localStorage.setItem('token', auth.accessToken);
        localStorage.setItem('user', JSON.stringify(auth.user));
      });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
  
  checkAuth: () => {
    return localStorage.getItem('token') ? Promise.resolve() : Promise.reject();
  },
  
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return Promise.reject();
    }
    return Promise.resolve();
  },
  
  getIdentity: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? Promise.resolve(JSON.parse(user)) : Promise.reject();
    } catch (error) {
      return Promise.reject(error);
    }
  },
  
  getPermissions: () => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        return Promise.resolve(parsedUser.role);
      }
      return Promise.reject();
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
