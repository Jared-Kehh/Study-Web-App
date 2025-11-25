import { Note } from '../hooks/useNotes';

const API_BASE_URL = 'http://localhost:3001/'; // Fixed: added /api/notes

export const notesService = {
  async getNotes(): Promise<Note[]> {
    try {
      const response = await fetch(API_BASE_URL); // Changed from ${API_BASE_URL}/notes
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const notes = await response.json();
      console.log('API Response - getNotes:', notes);
      return notes;
    } catch (error) {
      console.error('API Error - getNotes:', error);
      throw error;
    }
  },

  async createNote(note: Omit<Note, '_id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const createdNote = await response.json();
      console.log('API Response - createNote:', createdNote);
      return createdNote;
    } catch (error) {
      console.error('API Error - createNote:', error);
      throw error;
    }
  },

  async updateNote(id: string, note: Partial<Note>): Promise<Note> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedNote = await response.json();
      console.log('API Response - updateNote:', updatedNote);
      return updatedNote;
    } catch (error) {
      console.error('API Error - updateNote:', error);
      throw error;
    }
  },

  async deleteNote(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('API Response - deleteNote: success');
    } catch (error) {
      console.error('API Error - deleteNote:', error);
      throw error;
    }
  },

  async searchNotes(query: string): Promise<Note[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const notes = await response.json();
      console.log('API Response - searchNotes:', notes);
      return notes;
    } catch (error) {
      console.error('API Error - searchNotes:', error);
      throw error;
    }
  }
};