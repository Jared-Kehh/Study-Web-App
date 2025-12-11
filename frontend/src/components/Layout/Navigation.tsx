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
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};