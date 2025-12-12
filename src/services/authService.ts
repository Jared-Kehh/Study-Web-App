import { User } from '../types';

const API_URL = 'http://localhost:5000/api';

export const authService = {
  // ✅ Calls backend API - data saved in MongoDB
  signup: async (username: string, password: string): Promise<{ user: User; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { user: { username: '' }, error: data.error };
      }

      // ✅ Only store token and username in localStorage (not password!)
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));

      return { user: { username: data.user.username } };
    } catch (error) {
      return { user: { username: '' }, error: 'Network error' };
    }
  },

  // ✅ Calls backend API - verifies against MongoDB
  login: async (username: string, password: string): Promise<{ user: User; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { user: { username: '' }, error: data.error };
      }

      // ✅ Store JWT token (secure) instead of password
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));

      return { user: { username: data.user.username } };
    } catch (error) {
      return { user: { username: '' }, error: 'Network error' };
    }
  },

  logout: (): void => {
    // ✅ Remove token and user info
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: (): User | null => {
    // ✅ Get from localStorage (temporary, not sensitive data)
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  }
};