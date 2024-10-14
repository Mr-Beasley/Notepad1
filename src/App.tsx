import React, { useState, useEffect } from 'react';
import { PlusCircle, FileText, Search, Tag, FolderPlus } from 'lucide-react';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import TagManager from './components/TagManager';
import FolderTree from './components/FolderTree';
import TemplateSelector from './components/TemplateSelector';
import { Note, Folder, Template } from './types';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    const savedFolders = localStorage.getItem('folders');
    const savedTemplates = localStorage.getItem('templates');
    const savedTags = localStorage.getItem('tags');

    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedFolders) setFolders(JSON.parse(savedFolders));
    if (savedTemplates) setTemplates(JSON.parse(savedTemplates));
    if (savedTags) setTags(JSON.parse(savedTags));
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
    localStorage.setItem('folders', JSON.stringify(folders));
    localStorage.setItem('templates', JSON.stringify(templates));
    localStorage.setItem('tags', JSON.stringify(tags));
  }, [notes, folders, templates, tags]);

  const addNote = (template?: Template) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: template ? template.name : 'New Note',
      content: template ? template.content : '',
      tags: [],
      folderId: selectedFolderId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes([...notes, newNote]);
    setSelectedNoteId(newNote.id);
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(notes.map(note => note.id === updatedNote.id ? { ...updatedNote, updatedAt: Date.now() } : note));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
  };

  const addFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: folderName,
        parentId: selectedFolderId,
      };
      setFolders([...folders, newFolder]);
    }
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
    setNotes(notes.map(note => ({
      ...note,
      tags: note.tags.filter(t => t !== tag)
    })));
  };

  const filteredNotes = notes.filter(note =>
    (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!selectedTag || note.tags.includes(selectedTag)) &&
    (!selectedFolderId || note.folderId === selectedFolderId)
  );

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            addNote();
            break;
          case 'f':
            e.preventDefault();
            document.getElementById('search-input')?.focus();
            break;
          case 's':
            e.preventDefault();
            // Save is automatic, but we could add a visual indicator here
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="p-4">
          <button
            onClick={() => addNote()}
            className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-2"
          >
            <PlusCircle size={20} />
            <span>New Note</span>
          </button>
          <button
            onClick={addFolder}
            className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            <FolderPlus size={20} />
            <span>New Folder</span>
          </button>
        </div>
        <div className="px-4 mb-4">
          <div className="relative">
            <input
              id="search-input"
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
        <TagManager
          tags={tags}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          onAddTag={addTag}
          onRemoveTag={removeTag}
        />
        <FolderTree
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
        />
        <div className="flex-1 overflow-auto">
          <NoteList
            notes={filteredNotes}
            selectedNoteId={selectedNoteId}
            onSelectNote={setSelectedNoteId}
            onDeleteNote={deleteNote}
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {selectedNote ? (
          <NoteEditor
            note={selectedNote}
            onUpdateNote={updateNote}
            availableTags={tags}
            onAddTag={addTag}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FileText size={48} className="mx-auto mb-4" />
              <p>Select a note or create a new one</p>
              <TemplateSelector templates={templates} onSelectTemplate={(template) => addNote(template)} />
              <p className="mt-2 text-sm">
                Keyboard shortcuts:<br />
                Ctrl/Cmd + N: New Note<br />
                Ctrl/Cmd + F: Focus Search<br />
                Ctrl/Cmd + S: Save (automatic)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;