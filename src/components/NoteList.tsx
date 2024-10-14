import React from 'react';
import { Trash2, Tag } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, selectedNoteId, onSelectNote, onDeleteNote }) => {
  return (
    <ul className="space-y-2">
      {notes.map((note) => (
        <li
          key={note.id}
          className={`flex flex-col px-4 py-2 cursor-pointer hover:bg-gray-100 ${
            note.id === selectedNoteId ? 'bg-blue-100' : ''
          }`}
          onClick={() => onSelectNote(note.id)}
        >
          <div className="flex items-center justify-between">
            <span className="truncate font-medium">{note.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNote(note.id);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>
          {note.tags.length > 0 && (
            <div className="flex flex-wrap mt-1">
              {note.tags.map((tag) => (
                <span key={tag} className="flex items-center text-xs bg-gray-200 rounded-full px-2 py-1 mr-1 mt-1">
                  <Tag size={12} className="mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default NoteList;