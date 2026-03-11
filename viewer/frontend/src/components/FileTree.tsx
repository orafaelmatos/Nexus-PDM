import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FileIcon, Cuboid } from "lucide-react";
import type { FileNode } from "@/types/pdm";
import { is3DFile } from "@/types/pdm";

interface FileTreeProps {
  files: FileNode[];
  onSelectFile: (file: FileNode) => void;
  selectedPath: string | null;
}

function FileTreeNode({ node, depth, onSelectFile, selectedPath }: { node: FileNode; depth: number; onSelectFile: (f: FileNode) => void; selectedPath: string | null }) {
  const [open, setOpen] = useState(depth === 0);

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-1.5 py-1.5 px-2 text-sm hover:bg-surface-hover transition-colors rounded-sm text-left"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {open ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          <Folder className="h-4 w-4 text-primary/70" />
          <span className="text-foreground">{node.name}</span>
        </button>
        {open && node.children?.map((child) => (
          <FileTreeNode key={child.path} node={child} depth={depth + 1} onSelectFile={onSelectFile} selectedPath={selectedPath} />
        ))}
      </div>
    );
  }

  const is3D = is3DFile(node.name);

  return (
    <button
      onClick={() => onSelectFile(node)}
      className={`w-full flex items-center gap-1.5 py-1.5 px-2 text-sm transition-colors rounded-sm text-left ${
        selectedPath === node.path ? "bg-primary/10 text-primary" : "hover:bg-surface-hover text-muted-foreground"
      }`}
      style={{ paddingLeft: `${depth * 16 + 8}px` }}
    >
      <span className="w-3" />
      {is3D ? <Cuboid className="h-4 w-4 text-primary/60" /> : <FileIcon className="h-4 w-4 text-muted-foreground/60" />}
      <span className="truncate">{node.name}</span>
    </button>
  );
}

export function FileTree({ files, onSelectFile, selectedPath }: FileTreeProps) {
  return (
    <div className="py-1">
      {files.map((node) => (
        <FileTreeNode key={node.path} node={node} depth={0} onSelectFile={onSelectFile} selectedPath={selectedPath} />
      ))}
    </div>
  );
}
