import { useState, useRef, useCallback, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const useChat = (onProcessMessage: (message: string) => void) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your Study Assistant. I can help you with timer settings, study techniques, and motivation!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = useCallback((text: string): void => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const handleSendMessage = useCallback((e: React.FormEvent): void => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    onProcessMessage(inputMessage.toLowerCase());
    setInputMessage('');
  }, [inputMessage, onProcessMessage]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // IMPORTANT: Make sure chatEndRef is included in the return object
  return {
    messages,
    inputMessage,
    isOpen,
    chatEndRef, // <-- This must be here
    setInputMessage: useCallback((value: string) => setInputMessage(value), []),
    handleSendMessage,
    addBotMessage,
    toggleChat,
    setIsOpen: useCallback((value: boolean) => setIsOpen(value), []),
  };
};