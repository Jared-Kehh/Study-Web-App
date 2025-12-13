
// src/components/Layout/Header.tsx
// Updated to use CSS classes from index.css

import React from 'react';
import { BookOpen, LogOut } from 'lucide-react';
import { User } from '../../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <BookOpen className="header-logo-icon" />
          <h1 className="header-title">Study Timer</h1>
        </div>
        <div className="header-user">
          <span className="header-username">Welcome, {user.username}!</span>
          <button onClick={onLogout} className="logout-btn">
            <LogOut className="icon-sm" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};