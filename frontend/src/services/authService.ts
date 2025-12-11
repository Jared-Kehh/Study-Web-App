import { User } from '../types';

export const authService = {
  login: (username: string, password: string): User | null => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users[username] || users[username] !== password) {
      return null;
    }
    const user = { username };
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  },

  signup: (username: string, password: string): User | null => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username]) {
      return null;
    }
    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));
    const user = { username };
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  },

  logout: (): void => {
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: (): User | null => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  }
};