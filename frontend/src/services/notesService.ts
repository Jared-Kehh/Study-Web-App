import { Note } from '../types';

export const notesService = {
  getNotes: (username: string): Note[] => {
    const savedNotes = localStorage.getItem(`notes_${username}`);
    return savedNotes ? JSON.parse(savedNotes) : [];
  },

  saveNotes: (notes: Note[], username: string): void => {
    localStorage.setItem(`notes_${username}`, JSON.stringify(notes));
  },

  createNote: (title: string, content: string, username: string): Note[] => {
    const notes = notesService.getNotes(username);
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
    };
    const updatedNotes = [...notes, newNote];
    notesService.saveNotes(updatedNotes, username);
    return updatedNotes;
  },

  updateNote: (id: string, title: string, content: string, username: string): Note[] => {
    const notes = notesService.getNotes(username);
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, title, content } : note
    );
    notesService.saveNotes(updatedNotes, username);
    return updatedNotes;
  },

  deleteNote: (id: string, username: string): Note[] => {
    const notes = notesService.getNotes(username);
    const updatedNotes = notes.filter(note => note.id !== id);
    notesService.saveNotes(updatedNotes, username);
    return updatedNotes;
  }
};
