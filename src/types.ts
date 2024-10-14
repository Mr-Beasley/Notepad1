export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  folderId: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
}

export interface Template {
  id: string;
  name: string;
  content: string;
}

export type NoteOrFolder = Note | Folder;