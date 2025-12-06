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
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-between">
        <span>My Notes</span>
        <span className="text-sm font-normal text-gray-500">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </span>
      </h2>
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {notes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Plus className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No notes yet. Create your first note!</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                {note.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {note.content}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(note)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(note.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};