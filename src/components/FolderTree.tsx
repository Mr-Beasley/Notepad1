import React from 'react';
import { Folder, ChevronRight, ChevronDown } from 'lucide-react';
import { Folder as FolderType } from '../types';

interface FolderTreeProps {
  folders: FolderType[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
}

const FolderTree: React.FC<FolderTreeProps> = ({ folders, selectedFolderId, onSelectFolder }) => {
  const renderFolder = (folder: FolderType) => {
    const childFolders = folders.filter(f => f.parentId === folder.id);
    const isExpanded = true; // You can implement folder expansion logic here

    return (
      <div key={folder.id} className="ml-4">
        <div
          className={`flex items-center cursor-pointer py-1 ${folder.id === selectedFolderId ? 'bg-blue-100' : ''}`}
          onClick={() => onSelectFolder(folder.id)}
        >
          {childFolders.length > 0 ? (
            isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          ) : (
            <span className="w-4"></span>
          )}
          <Folder size={16} className="mr-2" />
          <span>{folder.name}</span>
        </div>
        {isExpanded && childFolders.map(childFolder => renderFolder(childFolder))}
      </div>
    );
  };

  const rootFolders = folders.filter(folder => !folder.parentId);

  return (
    <div className="px-4 mb-4">
      <h3 className="font-semibold mb-2">Folders</h3>
      {rootFolders.map(folder => renderFolder(folder))}
    </div>
  );
};

export default FolderTree;