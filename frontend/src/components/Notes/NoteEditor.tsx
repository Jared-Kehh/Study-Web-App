import React from 'react';
import { Save } from 'lucide-react';
import { Note } from '../../types';

interface NoteEditorProps {
  editingNote: Note | null;
  noteTitle: string;
  noteContent: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  editingNote,
  noteTitle,
  noteContent,
  onTitleChange,
  onContentChange,
  onSave,
  onCancel,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {editingNote ? 'Edit Note' : 'Create New Note'}
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter note title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            value={noteContent}
            onChange={(e) => onContentChange(e.target.value)}
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            placeholder="Write your notes here..."
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSave}
            disabled={!noteTitle.trim() || !noteContent.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {editingNote ? 'Update Note' : 'Save Note'}
          </button>
          {editingNote && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};