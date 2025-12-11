import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { User } from '../../types';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    if (isSignup) {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      if (users[username]) {
        setError('Username already exists!');
        return;
      }
      users[username] = password;
      localStorage.setItem('users', JSON.stringify(users));
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      if (!users[username] || users[username] !== password) {
        setError('Invalid username or password!');
        return;
      }
    }

    const user = { username };
    localStorage.setItem('currentUser', JSON.stringify(user));
    onLogin(user);
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <BookOpen className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">Study Timer App</h1>
          <p className="text-gray-600 mt-2">Focus on your learning journey</p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </button>

          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
            className="w-full text-indigo-600 py-2 hover:text-indigo-700 transition-colors text-sm"
          >
            {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};