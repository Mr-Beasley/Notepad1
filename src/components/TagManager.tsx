import React, { useState } from 'react';
import { Tag, X } from 'lucide-react';

interface TagManagerProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

const TagManager: React.FC<TagManagerProps> = ({ tags, selectedTag, onSelectTag, onAddTag, onRemoveTag }) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      onAddTag(newTag);
      setNewTag('');
    }
  };

  return (
    <div className="px-4 mb-4">
      <h3 className="font-semibold mb-2">Tags</h3>
      <div className="flex flex-wrap mb-2">
        {tags.map(tag => (
          <span
            key={tag}
            onClick={() => onSelectTag(tag === selectedTag ? null : tag)}
            className={`flex items-center cursor-pointer ${
              tag === selectedTag ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            } rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2`}
          >
            <Tag size={14} className="mr-1" />
            {tag}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveTag(tag);
              }}
              className="ml-1 hover:text-red-500"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
          placeholder="New tag..."
          className="flex-1 border rounded-l px-2 py-1 text-sm"
        />
        <button
          onClick={handleAddTag}
          className="bg-blue-500 text-white rounded-r px-2 py-1 text-sm"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default TagManager;