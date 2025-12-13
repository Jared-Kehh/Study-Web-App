import { Note } from '../types';

const API_URL = 'https://study-web-app-idfx.onrender.com/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const notesService = {
  // ✅ GET notes from MongoDB backend
  getNotes: async (): Promise<Note[]> => {
    try {
      const response = await fetch(`${API_URL}/notes`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }

      const notes = await response.json();
      return notes;
    } catch (error) {
      console.error('Get notes error:', error);
      return [];
    }
  },

  // ✅ CREATE note in MongoDB backend
  createNote: async (title: string, content: string): Promise<Note | null> => {
    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, content })
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      const note = await response.json();
      return note;
    } catch (error) {
      console.error('Create note error:', error);
      return null;
    }
  },

  // ✅ UPDATE note in MongoDB backend
  updateNote: async (id: string, title: string, content: string): Promise<Note | null> => {
    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, content })
      });

      if (!response.ok) {
        throw new Error('Failed to update note');
      }

      const note = await response.json();
      return note;
    } catch (error) {
      console.error('Update note error:', error);
      return null;
    }
  },

  // ✅ DELETE note from MongoDB backend
  deleteNote: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      return true;
    } catch (error) {
      console.error('Delete note error:', error);
      return false;
    }
  }
};