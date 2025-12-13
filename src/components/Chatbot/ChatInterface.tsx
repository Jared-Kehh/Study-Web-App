import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Message } from '../../types';

interface ChatInterfaceProps {
  messages: Message[];
  inputMessage: string;
  isLoading: boolean;
  onInputChange: (message: string) => void;
  onSend: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  inputMessage,
  isLoading,
  onInputChange,
  onSend,
}) => {
  return (
    <div className="chat-container">
      <div className="chat-card">
        <div className="chat-header">
          <h2 className="chat-header-title">Study Assistant</h2>
          <p className="chat-header-subtitle">
            Ask me about study techniques, time management, or any learning concepts!
          </p>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <MessageSquare className="empty-state-icon" />
              <p>Start a conversation to get study help!</p>
              <p>Try asking about:</p>
              <ul>
                <li>• Effective study techniques</li>
                <li>• Time management strategies</li>
                <li>• How to stay focused</li>
                <li>• Understanding difficult concepts</li>
              </ul>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={msg.role === 'user' ? 'message-wrapper-user' : 'message-wrapper-assistant'}
              >
                <div className={msg.role === 'user' ? 'message-user' : 'message-assistant'}>
                  <p className="message-content">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="chat-loading">
              <div className="chat-loading-bubble">
                <p className="chat-loading-text">Thinking...</p>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && inputMessage.trim() && onSend()}
              placeholder="Ask a question about studying..."
              className="chat-input"
              disabled={isLoading}
            />
            <button
              onClick={onSend}
              disabled={!inputMessage.trim() || isLoading}
              className="chat-send-btn"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};