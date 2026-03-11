import { useState, useRef } from "react";
import { X, Upload, Folder, FileUp, Download, Info, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface UploadModalProps {
  onClose: () => void;
  onUpload: (files: File[], comment: string) => Promise<void>;
}

interface UploadingFile {
  file: File;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
}

export function UploadModal({ onClose, onUpload }: UploadModalProps) {
  const [step, setStep] = useState<'selection' | 'preview'>('selection');
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [comment, setComment] = useState("V1");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({
        file: f,
        status: 'pending' as const,
        progress: 0
      }));
      setFiles([...files, ...newFiles]);
      setStep('preview');
    }
  };

  const removeFile = (index: number) => {
    if (isUploading) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (newFiles.length === 0) setStep('selection');
  };

  const handleUploadClick = async () => {
    if (files.length === 0 || isUploading) return;
    
    setIsUploading(true);
    setFiles(prev => prev.map(f => ({ ...f, status: 'uploading', progress: 50 })));
    
    try {
      await onUpload(files.map(f => f.file), comment);
      setFiles(prev => prev.map(f => ({ ...f, status: 'completed', progress: 100 })));
      // Pequeno delay antes de fechar para o usuário ver o sucesso
      setTimeout(onClose, 1000);
    } catch (error) {
      setFiles(prev => prev.map(f => ({ ...f, status: 'error', progress: 0 })));
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f0f0f] border border-border/50 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {step === 'selection' ? 'Upload Files to Repository' : 'Check your input'}
              </h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                {step === 'selection' ? 'Select files to upload to the repository' : 'Confirm versions and add comments'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          {step === 'selection' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-3 p-8 border border-border/50 rounded-2xl bg-secondary/20 hover:bg-secondary/40 transition-all group"
                >
                  <div className="p-4 rounded-full bg-background border border-border group-hover:border-primary/50 transition-colors">
                    <FileUp className="h-8 w-8 text-primary" />
                  </div>
                  <span className="text-sm font-semibold">Select files</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-3 p-8 border border-border/50 rounded-2xl bg-secondary/20 hover:border-border/50 opacity-50 cursor-not-allowed">
                  <div className="p-4 rounded-full bg-background border border-border">
                    <Folder className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-semibold">Select folder</span>
                </button>
              </div>

              <div 
                className="border-2 border-dashed border-border/50 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 bg-white/[0.01] hover:bg-white/[0.02] transition-colors cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  // Handle drop logic
                }}
              >
                <p className="text-lg font-medium text-muted-foreground">Drop your files or folders into this window</p>
              </div>

              {/* Add-in Promotion (from image) */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex gap-6 items-center">
                <div className="w-48 h-28 bg-[#1a1a1a] rounded-lg border border-border/50 overflow-hidden shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center">
                    <img src="/addin-preview.png" alt="Add-in" className="opacity-50" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-foreground">Install the Sibe Add-in for SolidWorks</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    We only support online viewing, sharing and commenting for files uploaded via Web. To be able to check out and check in your components, install the Add-in.
                  </p>
                  <Button variant="link" className="text-primary p-0 h-auto mt-2 text-xs font-bold gap-1">
                    Download Sibe Add-in <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Add-in Mini Bar (from image) */}
              <div className="px-4 py-2 bg-secondary/30 rounded-full border border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">Install Sibe Add-in for SolidWorks</span>
                </div>
                <Button size="sm" className="h-7 px-4 rounded-full bg-primary text-[10px] font-bold">
                  Download Sibe Add-in
                </Button>
              </div>

              {/* File List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {files.map((fileObj, idx) => (
                  <div key={idx} className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-border/40 hover:bg-white/[0.02] transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-secondary/50">
                        <FileUp className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{fileObj.file.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Local Import/{fileObj.file.name.split('.')[0]}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {(fileObj.file.size / 1024).toFixed(2)} KB
                      </span>
                      {fileObj.status === 'completed' ? (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1.5 h-6">
                          <CheckCircle2 className="h-3 w-3" /> Uploaded
                        </Badge>
                      ) : fileObj.status === 'uploading' ? (
                        <div className="flex items-center gap-2">
                           <Loader2 className="h-3 w-3 animate-spin text-primary" />
                           <span className="text-[10px] font-bold text-primary animate-pulse">Uploading...</span>
                        </div>
                      ) : fileObj.status === 'error' ? (
                        <Badge variant="destructive" className="gap-1.5 h-6">
                           Error
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-muted animate-pulse" />
                          <span className="text-[10px] font-bold text-muted-foreground">Pending</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeFile(idx)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors ml-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment Input */}
              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Comment <span className="text-destructive">*</span></label>
                <div className="relative">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-secondary/30 border border-border/40 rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 transition-colors min-h-[80px] resize-none"
                    placeholder="Describe the changes in this version..."
                  />
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <span className="text-primary font-mono text-xs font-bold">{comment === 'V1' ? '' : ''}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-border/40 bg-secondary/10 flex items-center justify-between">
          <div className="flex gap-2">
            {step === 'preview' && (
              <>
                <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="text-xs font-bold gap-2">
                  <FileUp className="h-4 w-4" /> Add Files
                </Button>
                <Button variant="ghost" size="sm" className="text-xs font-bold gap-2">
                  <Folder className="h-4 w-4" /> Add Folder
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button 
               variant="ghost" 
               onClick={onClose} 
               disabled={isUploading}
               className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >
              Cancel
            </Button>
            {step === 'preview' && (
              <Button
                onClick={handleUploadClick}
                disabled={files.length === 0 || isUploading}
                className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold uppercase tracking-widest h-11 rounded-lg gap-2 min-w-[120px]"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" /> Upload
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
