import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Tag, X, Bold, Italic, List, Heading } from 'lucide-react';
import { Note } from '../types';

interface NoteEditorProps {
  note: Note;
  onUpdateNote: (note: Note) => void;
  availableTags: string[];
  onAddTag: (tag: string) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onUpdateNote, availableTags, onAddTag }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isPreview, setIsPreview] = useState(false);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    onUpdateNote({ ...note, title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onUpdateNote({ ...note, content: e.target.value });
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  const addTag = () => {
    if (newTag && !note.tags.includes(newTag)) {
      const updatedNote = { ...note, tags: [...note.tags, newTag] };
      onUpdateNote(updatedNote);
      onAddTag(newTag);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedNote = { ...note, tags: note.tags.filter(tag => tag !== tagToRemove) };
    onUpdateNote(updatedNote);
  };

  const insertFormatting = (startChar: string, endChar: string = startChar) => {
    const textarea = document.getElementById('note-content') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent = content.substring(0, start) + startChar + selectedText + endChar + content.substring(end);
    setContent(newContent);
    onUpdateNote({ ...note, content: newContent });
    textarea.focus();
    textarea.setSelectionRange(start + startChar.length, end + startChar.length);
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        className="text-2xl font-bold mb-4 p-2 border-b"
        placeholder="Note title"
      />
      <div className="mb-4 flex flex-wrap items-center">
        {note.tags.map(tag => (
          <span key={tag} className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
            <Tag size={14} className="mr-1" />
            {tag}
            <button onClick={() => removeTag(tag)} className="ml-1 text-blue-600 hover:text-blue-800">
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTag()}
          placeholder="Add tag..."
          className="border rounded px-2 py-1 text-sm mr-2 mb-2"
        />
        <button onClick={addTag} className="bg-blue-500 text-white rounded px-2 py-1 text-sm mb-2">
          Add Tag
        </button>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="mb-2 flex space-x-2">
          <button
            onClick={togglePreview}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>
          <button onClick={() => insertFormatting('**')} className="bg-gray-200 hover:bg-gray-300 p-2 rounded">
            <Bold size={20} />
          </button>
          <button onClick={() => insertFormatting('*')} className="bg-gray-200 hover:bg-gray-300 p-2 rounded">
            <Italic size={20} />
          </button>
          <button onClick={() => insertFormatting('# ')} className="bg-gray-200 hover:bg-gray-300 p-2 rounded">
            <Heading size={20} />
          </button>
          <button onClick={() => insertFormatting('- ')} className="bg-gray-200 hover:bg-gray-300 p-2 rounded">
            <List size={20} />
          </button>
        </div>
        {isPreview ? (
          <div className="flex-1 border rounded p-4 overflow-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            id="note-content"
            value={content}
            onChange={handleContentChange}
            className="flex-1 p-2 border rounded"
            placeholder="Start typing your note here... (Markdown supported)"
          />
        )}
      </div>
    </div>
  );
};

export default NoteEditor;