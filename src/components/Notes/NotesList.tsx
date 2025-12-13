import React from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Note } from '../../types';

interface NotesListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export const NotesList: React.FC<NotesListProps> = ({ notes, onEdit, onDelete }) => {
  return (
    <div className="notes-list">
      <h2 className="notes-list-header">
        <span>My Notes</span>
        <span className="notes-count">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </span>
      </h2>
      <div className="notes-container">
        {notes.length === 0 ? (
          <div className="empty-state">
            <Plus className="empty-state-icon" />
            <p>No notes yet. Create your first note!</p>
          </div>
        ) : (
          notes.map((note) => {
            const noteId = note._id || note.id;
            return (
              <div key={noteId} className="note-item">
                <h3 className="note-title">{note.title}</h3>
                <p className="note-content">{note.content}</p>
                <div className="note-footer">
                  <span className="note-date">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <div className="note-actions">
                    <button
                      onClick={() => onEdit(note)}
                      className="note-edit-btn"
                      title="Edit note"
                    >
                      <Edit className="icon-sm" />
                    </button>
                    <button
                      onClick={() => noteId && onDelete(noteId)}
                      className="note-delete-btn"
                      title="Delete note"
                    >
                      <Trash2 className="icon-sm" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};