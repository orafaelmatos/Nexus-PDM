export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  createdAt: string;
  folderPath: string;
  memberCount: number;
}

export interface ProjectMember {
  id: string;
  userId: string;
  email: string;
  role: "owner" | "engineer" | "viewer";
  joinedAt: string;
}

export interface FileNode {
  name: string;
  type: "file" | "folder";
  size?: number;
  lastModified?: string;
  extension?: string;
  path: string;
  children?: FileNode[];
  nome?: string; // Para compatibilidade com o backend
  caminho_relativo?: string; // Para compatibilidade com o backend
}

export interface Invitation {
  id: string;
  email: string;
  role: "engineer" | "viewer";
  status: "pending" | "accepted" | "declined";
  sentAt: string;
}

export type UserRole = "owner" | "engineer" | "viewer";

export const VIEWABLE_3D_EXTENSIONS = [".stp", ".step", ".stl", ".iam", ".ipt", ".sldprt", ".sldasm"];

export function is3DFile(filename: string): boolean {
  if (!filename) return false;
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1) return false;
  const ext = filename.toLowerCase().substring(lastDotIndex);
  return VIEWABLE_3D_EXTENSIONS.includes(ext);
}
