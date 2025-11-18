import React from 'react';
import { ChatMessage } from '../hooks/useChat';

interface ChatBotProps {
  isOpen: boolean;
  messages: ChatMessage[];
  inputMessage: string;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: (e: React.FormEvent) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({
  isOpen,
  messages,
  inputMessage,
  chatEndRef,
  onClose,
  onInputChange,
  onSendMessage
}) => {
  if (!isOpen) return null;

  return (
    <div className="chatbot">
      <div className="chat-header">
        <h3>Study Assistant</h3>
        <button 
          className="close-chat"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">
              {message.text.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {/* This is where the ref gets attached */}
        <div ref={chatEndRef} />
      </div>
      
      <form onSubmit={onSendMessage} className="chat-input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={onInputChange}
          placeholder="Ask about study techniques, timer help, or motivation..."
          className="chat-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBot;