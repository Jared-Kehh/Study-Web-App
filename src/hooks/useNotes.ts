import { useState, useCallback } from 'react';
import { Note } from '../types';
import { notesService } from '../services/notesService';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [noteTags, setNoteTags] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const loadNotes = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const fetchedNotes = await notesService.getNotes();
      setNotes(fetchedNotes);
    } catch (err) {
      setError('Failed to load notes');
      console.error('Error loading notes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewNote = useCallback((): void => {
    const newNote: Note = {
      title: 'New Note',
      content: '',
      tags: [],
      createdAt: new Date(),
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
      if (currentNote && currentNote._id) {
        const updatedNote = await notesService.updateNote(currentNote._id, {
          title: noteTitle,
          content: noteContent,
          tags: noteTags.split(',').map(tag => tag.trim()).filter(tag => tag),
          updatedAt: new Date()
        });
        setNotes(prev => prev.map(note => 
          note._id === updatedNote._id ? updatedNote : note
        ));
      } else {
        const newNote = await notesService.createNote({
          title: noteTitle,
          content: noteContent,
          tags: noteTags.split(',').map(tag => tag.trim()).filter(tag => tag),
        });
        setNotes(prev => [...prev, newNote]);
      }
      setCurrentNote(null);
      setNoteTitle('');
      setNoteContent('');
      setNoteTags('');
    } catch (err) {
      setError('Failed to save note');
      console.error('Error saving note:', err);
    } finally {
      setLoading(false);
    }
  }, [currentNote, noteTitle, noteContent, noteTags]);

  const editNote = useCallback((note: Note): void => {
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
      await notesService.deleteNote(noteId);
      setNotes(prev => prev.filter(note => note._id !== noteId));
      if (currentNote?._id === noteId) {
        setCurrentNote(null);
        setNoteTitle('');
        setNoteContent('');
        setNoteTags('');
      }
    } catch (err) {
      setError('Failed to delete note');
      console.error('Error deleting note:', err);
    } finally {
      setLoading(false);
    }
  }, [currentNote]);

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
    setNoteTitle,
    setNoteContent,
    setNoteTags,
    setSearchTerm,
    loadNotes,
    createNewNote,
    saveNote,
    editNote,
    deleteNote,
    clearCurrentNote: () => {
      setCurrentNote(null);
      setNoteTitle('');
      setNoteContent('');
      setNoteTags('');
    }
  };
};