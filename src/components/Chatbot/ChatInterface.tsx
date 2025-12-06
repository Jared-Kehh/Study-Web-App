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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Study Assistant</h2>
          <p className="text-indigo-100">
            Ask me about study techniques, time management, or any learning concepts!
          </p>
        </div>

        <div className="h-[500px] overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Start a conversation to get study help!</p>
              <p className="text-sm mt-2">Try asking about:</p>
              <ul className="text-sm mt-2 space-y-1">
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
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-gray-600">Thinking...</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSend()}
              placeholder="Ask a question about studying..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={onSend}
              disabled={!inputMessage.trim() || isLoading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};