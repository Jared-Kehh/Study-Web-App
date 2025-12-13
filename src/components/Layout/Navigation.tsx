// src/components/Layout/Navigation.tsx
// Updated to use CSS classes from index.css

import React from 'react';
import { Clock, BookOpen, MessageSquare } from 'lucide-react';
import { TabType } from '../../types';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'timer' as TabType, label: 'Study Timer', icon: Clock },
    { id: 'notes' as TabType, label: 'My Notes', icon: BookOpen },
    { id: 'chatbot' as TabType, label: 'Study Assistant', icon: MessageSquare },
  ];

  return (
    <nav className="nav-tabs">
      <div className="nav-tabs-container">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <div className="nav-tab-content">
                <Icon className="nav-tab-icon" />
                <span>{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};