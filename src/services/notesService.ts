const API_BASE_URL = 'http://localhost:3001/api'; // Adjust to your server URL

export interface Note {
  _id?: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId?: string; // If you have user authentication
}

export const notesService = {
  // Get all notes
  async getNotes(): Promise<Note[]> {
    const response = await fetch(`${API_BASE_URL}/notes`);
    if (!response.ok) {
      throw new Error('Failed to fetch notes');
    }
    return response.json();
  },

  // Create a new note
  async createNote(note: Omit<Note, '_id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
    if (!response.ok) {
      throw new Error('Failed to create note');
    }
    return response.json();
  },

  // Update an existing note
  async updateNote(id: string, note: Partial<Note>): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
    if (!response.ok) {
      throw new Error('Failed to update note');
    }
    return response.json();
  },

  // Delete a note
  async deleteNote(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete note');
    }
  },

  // Search notes
  async searchNotes(query: string): Promise<Note[]> {
    const response = await fetch(`${API_BASE_URL}/notes/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search notes');
    }
    return response.json();
  }
};