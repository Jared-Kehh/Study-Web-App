import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { User } from '../../types';
import { authService } from '../../services/authService';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);

    if (!username || !password) {
      setError('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    try {
      // ✅ Calls backend API instead of localStorage
      const result = isSignup 
        ? await authService.signup(username, password)
        : await authService.login(username, password);

      if (result.error) {
        setError(result.error);
      } else {
        onLogin(result.user);
        setPassword('');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="text-center mb-8">
          <BookOpen className="login-icon" />
          <h1 className="login-title">Study Timer App</h1>
          <p className="login-subtitle">Focus on your learning journey</p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="alert-error">{error}</div>
          )}

          <div>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full btn-primary"
          >
            {isLoading ? 'Please wait...' : (isSignup ? 'Sign Up' : 'Login')}
          </button>

          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
            className="w-full btn-text"
            disabled={isLoading}
          >
            {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};