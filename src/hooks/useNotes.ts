import { useState, useCallback } from 'react';
import { notesService } from '../services/notesService';

export interface Note {
  _id?: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: Date;
  userId?: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [noteTags, setNoteTags] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Load notes from MongoDB
  const loadNotes = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      console.log('Loading notes from API...');
      const fetchedNotes = await notesService.getNotes();
      console.log('Fetched notes:', fetchedNotes);
      setNotes(fetchedNotes);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load notes';
      setError(errorMessage);
      console.error('Error loading notes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewNote = useCallback((): void => {
    console.log('Creating new note...');
    const newNote: Note = {
      title: 'New Note',
      content: '',
      tags: [],
      updatedAt: new Date()
    };
    setCurrentNote(newNote);
    setNoteTitle('New Note');
    setNoteContent('');
    setNoteTags('');
  }, []);

  const saveNote = useCallback(async (): Promise<void> => {
    if (!noteTitle.trim()) {
      alert('Please add a title for your note');
      return;
    }

    setLoading(true);
    setError('');
    try {
      console.log('Saving note...', { noteTitle, noteContent, noteTags });
      
      if (currentNote && currentNote._id) {
        // Update existing note
        const updatedNote = await notesService.updateNote(currentNote._id, {
          title: noteTitle,
          content: noteContent,
          tags: noteTags.split(',').map(tag => tag.trim()).filter(tag => tag),
          updatedAt: new Date()
        });
        setNotes(prev => prev.map(note => 
          note._id === updatedNote._id ? updatedNote : note
        ));
        console.log('Note updated:', updatedNote);
      } else {
        // Create new note
        const newNote = await notesService.createNote({
          title: noteTitle,
          content: noteContent,
          tags: noteTags.split(',').map(tag => tag.trim()).filter(tag => tag)
        });
        setNotes(prev => [...prev, newNote]);
        console.log('Note created:', newNote);
      }
      
      // Clear the editor
      setCurrentNote(null);
      setNoteTitle('');
      setNoteContent('');
      setNoteTags('');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save note';
      setError(errorMessage);
      console.error('Error saving note:', err);
    } finally {
      setLoading(false);
    }
  }, [currentNote, noteTitle, noteContent, noteTags]);

  const editNote = useCallback((note: Note): void => {
    console.log('Editing note:', note);
    setCurrentNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteTags(note.tags.join(', '));
  }, []);

  const deleteNote = useCallback(async (noteId: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    setLoading(true);
    setError('');
    try {
      console.log('Deleting note:', noteId);
      await notesService.deleteNote(noteId);
      setNotes(prev => prev.filter(note => note._id !== noteId));
      
      if (currentNote?._id === noteId) {
        setCurrentNote(null);
        setNoteTitle('');
        setNoteContent('');
        setNoteTags('');
      }
      console.log('Note deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete note';
      setError(errorMessage);
      console.error('Error deleting note:', err);
    } finally {
      setLoading(false);
    }
  }, [currentNote]);

  const clearCurrentNote = useCallback((): void => {
    setCurrentNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteTags('');
  }, []);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return {
    notes: filteredNotes,
    allNotes: notes,
    currentNote,
    noteTitle,
    noteContent,
    noteTags,
    searchTerm,
    loading,
    error,
    setNoteTitle: useCallback((value: string) => setNoteTitle(value), []),
    setNoteContent: useCallback((value: string) => setNoteContent(value), []),
    setNoteTags: useCallback((value: string) => setNoteTags(value), []),
    setSearchTerm: useCallback((value: string) => setSearchTerm(value), []),
    loadNotes,
    createNewNote,
    saveNote,
    editNote,
    deleteNote,
    clearCurrentNote,
  };
};