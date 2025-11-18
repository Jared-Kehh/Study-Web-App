import React from 'react';
import { Note } from '../types';
import { formatDate, handleInputChange } from '../utils';

interface NotesPanelProps {
  isOpen: boolean;
  notes: Note[];
  allNotesCount: number;
  currentNote: Note | null;
  noteTitle: string;
  noteContent: string;
  noteTags: string;
  searchTerm: string;
  loading: boolean;
  onClose: () => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNewNote: () => void;
  onRefreshNotes: () => void;
  onSaveNote: () => void;
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onTagsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancelEdit: () => void;
}

const NotesPanel: React.FC<NotesPanelProps> = ({
  isOpen,
  notes,
  allNotesCount,
  currentNote,
  noteTitle,
  noteContent,
  noteTags,
  searchTerm,
  loading,
  onClose,
  onSearchChange,
  onNewNote,
  onRefreshNotes,
  onSaveNote,
  onEditNote,
  onDeleteNote,
  onTitleChange,
  onContentChange,
  onTagsChange,
  onCancelEdit
}) => {
  if (!isOpen) return null;

  return (
    <div className="notes-panel">
      <div className="notes-header">
        <h3>My Study Notes ({allNotesCount})</h3>
        <button 
          className="close-notes"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <div className="notes-toolbar">
        <button className="btn new-note" onClick={onNewNote}>
          + New Note
        </button>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={onSearchChange}
          className="search-notes"
        />
        <button 
          className="btn refresh-notes" 
          onClick={onRefreshNotes}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="notes-content">
        {loading && !currentNote ? (
          <div className="loading">Loading notes...</div>
        ) : currentNote ? (
          <div className="note-editor">
            <input
              type="text"
              value={noteTitle}
              onChange={onTitleChange}
              placeholder="Note title..."
              className="note-title-input"
            />
            <textarea
              value={noteContent}
              onChange={onContentChange}
              placeholder="Write your notes here..."
              className="note-content-input"
              rows={15}
            />
            <input
              type="text"
              value={noteTags}
              onChange={onTagsChange}
              placeholder="Tags (comma separated)..."
              className="note-tags-input"
            />
            <div className="note-actions">
              <button 
                className="btn save-note" 
                onClick={onSaveNote}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Note'}
              </button>
              <button 
                className="btn cancel-note" 
                onClick={onCancelEdit}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="notes-list">
            {notes.length === 0 ? (
              <div className="empty-notes">
                {allNotesCount === 0 ? (
                  <>
                    <h4>No notes yet</h4>
                    <p>Create your first note to get started!</p>
                    <button className="btn new-note" onClick={onNewNote}>
                      Create First Note
                    </button>
                  </>
                ) : (
                  <p>No notes match your search.</p>
                )}
              </div>
            ) : (
              notes.map(note => (
                <div key={note._id} className="note-card">
                  <div className="note-card-header">
                    <h4>{note.title}</h4>
                    <div className="note-actions">
                      <button 
                        className="btn edit-note"
                        onClick={() => onEditNote(note)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn delete-note"
                        onClick={() => note._id && onDeleteNote(note._id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="note-preview">
                    {note.content.substring(0, 150)}
                    {note.content.length > 150 ? '...' : ''}
                  </p>
                  <div className="note-tags">
                    {note.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <div className="note-date">
                    Updated: {formatDate(note.updatedAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPanel;