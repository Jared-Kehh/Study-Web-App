import { Message } from '../types';

export const chatService = {
  sendMessage: async (messages: Message[]): Promise<string> => {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: 'You are a helpful study assistant. Help students with study techniques, time management, learning strategies, and understanding concepts. Be encouraging and provide practical advice.',
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
        }),
      });

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to get response from chatbot');
    }
  }
};