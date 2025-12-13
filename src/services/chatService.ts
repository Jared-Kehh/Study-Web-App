import { Message } from '../types';

export const chatService = {
  sendMessage: async (messages: Message[]): Promise<string> => {
    try {
      const response = await fetch('https://study-web-app-idfx.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Chat Service Error:', error);
      throw error;
    }
  }
};