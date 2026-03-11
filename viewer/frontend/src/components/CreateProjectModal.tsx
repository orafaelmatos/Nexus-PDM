import { useState } from "react";
import { X, Globe, Lock, Info, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CreateProjectModalProps {
  onClose: () => void;
  onCreate: (name: string, description: string, isPublic: boolean) => void;
}

export function CreateProjectModal({ onClose, onCreate }: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const handleCreate = () => {
    if (name) {
      onCreate(name, description, isPublic);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f0f0f] border border-border/50 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Folder className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Novo Projeto PDM</h2>
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono">Workspace Management</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-secondary/80">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Nome do Projeto</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Protótipo Asa Delta V2"
                className="bg-secondary/30 border-border/40 focus-visible:ring-primary/50 h-11 text-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Descrição do Escopo</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva os objetivos e componentes principais deste projeto..."
                rows={4}
                className="bg-secondary/30 border-border/40 focus-visible:ring-primary/50 text-sm rounded-lg resize-none min-h-[100px]"
              />
            </div>
          </div>

          {/* Privacy Toggle */}
          <div className="space-y-3 pt-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Privacidade do Projeto</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsPublic(false)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                  !isPublic 
                    ? "bg-primary/10 border-primary/40 ring-1 ring-primary/40" 
                    : "bg-transparent border-border/40 hover:bg-secondary/20"
                }`}
              >
                <div className={`p-2 rounded-lg ${!isPublic ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${!isPublic ? "text-foreground" : "text-muted-foreground"}`}>Privado</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">Apenas convidados</p>
                </div>
              </button>

              <button
                onClick={() => setIsPublic(true)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                  isPublic 
                    ? "bg-primary/10 border-primary/40 ring-1 ring-primary/40" 
                    : "bg-transparent border-border/40 hover:bg-secondary/20"
                }`}
              >
                <div className={`p-2 rounded-lg ${isPublic ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${isPublic ? "text-foreground" : "text-muted-foreground"}`}>Público</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">Visível no workspace</p>
                </div>
              </button>
            </div>
          </div>

          {/* Path Preview */}
          <div className="bg-white/[0.03] border border-dashed border-border/60 rounded-xl p-4 flex items-start gap-3">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">Armazenamento Físico</p>
              <code className="text-xs text-primary font-mono block break-all">
                /data/pdm_projects/{name ? name.toLowerCase().replace(/\s+/g, "_") : "..."}
              </code>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-border/40 bg-secondary/10 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Cancelar
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name}
            className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold uppercase tracking-widest h-11 rounded-lg shadow-[0_4px_14px_rgba(59,130,246,0.3)]"
          >
            Criar Projeto
          </Button>
        </div>
      </div>
    </div>
  );
}
