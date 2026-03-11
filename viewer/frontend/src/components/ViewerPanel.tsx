import { Cuboid, Download } from "lucide-react";
import type { FileNode } from "@/types/pdm";
import { is3DFile } from "@/types/pdm";

interface ViewerPanelProps {
  selectedFile: FileNode | null;
}

function formatSize(bytes: number): string {
  if (bytes > 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes > 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
  return `${bytes} B`;
}

export function ViewerPanel({ selectedFile }: ViewerPanelProps) {
  if (!selectedFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <Cuboid className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Select a file to preview</p>
          <p className="text-muted-foreground/50 text-xs mt-1 font-mono">Supports .stp .step .stl .iam .ipt .sldprt .sldasm</p>
        </div>
      </div>
    );
  }

  const is3D = is3DFile(selectedFile.name);

  if (is3D) {
    return (
      <div className="flex-1 flex flex-col bg-background">
        <div className="h-10 flex items-center justify-between px-4 border-b">
          <div className="flex items-center gap-2">
            <Cuboid className="h-4 w-4 text-primary" />
            <span className="text-sm font-mono text-foreground">{selectedFile.name}</span>
          </div>
          <span className="text-label">{selectedFile.size ? formatSize(selectedFile.size) : ""}</span>
        </div>
        <div className="flex-1 flex items-center justify-center relative">
          {/* 3D Viewer placeholder — Autodesk Viewer SDK would mount here */}
          <div className="absolute inset-0 bg-gradient-to-b from-background to-card" />
          <div className="relative z-10 text-center">
            <div className="w-32 h-32 mx-auto mb-4 border border-primary/20 rounded-sm flex items-center justify-center glow-cyan">
              <Cuboid className="h-16 w-16 text-primary/40" />
            </div>
            <p className="text-sm text-muted-foreground font-mono">Autodesk Viewer SDK</p>
            <p className="text-xs text-muted-foreground/50 mt-1">3D preview will render here</p>
            <div className="mt-4 flex items-center gap-2 justify-center">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-mono rounded-sm">
                {selectedFile.extension?.toUpperCase()}
              </span>
              <span className="text-xs text-muted-foreground">
                {selectedFile.lastModified}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 border border-border rounded-sm flex items-center justify-center bg-card">
          <span className="text-xs font-mono text-muted-foreground">{selectedFile.extension?.toUpperCase()}</span>
        </div>
        <p className="text-sm text-foreground mb-1">{selectedFile.name}</p>
        <p className="text-xs text-muted-foreground mb-4">
          {selectedFile.size ? formatSize(selectedFile.size) : ""} · {selectedFile.lastModified}
        </p>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-surface-hover transition-colors text-sm text-foreground rounded-sm mx-auto font-mono">
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>
    </div>
  );
}
