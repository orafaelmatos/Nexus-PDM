import { useState, useEffect } from "react";
import { 
  Users, 
  Calendar, 
  FolderOpen, 
  UserPlus, 
  Shield, 
  ExternalLink, 
  MoreVertical, 
  Plus, 
  Upload, 
  FolderPlus, 
  HelpCircle, 
  FileText, 
  Info, 
  CheckCircle2, 
  MoreHorizontal,
  Pencil,
  CheckCircle,
  Download,
  Trash2,
  Box,
  Boxes,
  ReceiptText
} from "lucide-react";
import { IoCube } from "react-icons/io5";
import { FaCubes  } from "react-icons/fa";
import { TbCubeUnfolded } from "react-icons/tb";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import type { Project, FileNode } from "@/types/pdm";
import { FileTree } from "@/components/FileTree";
import { ViewerPanel } from "@/components/ViewerPanel";
import { InviteModal } from "@/components/InviteModal";
import { UploadModal } from "@/components/UploadModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

interface ProjectDashboardProps {
  project: Project;
}

export function ProjectDashboard({ project }: ProjectDashboardProps) {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [projectFiles, setProjectFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjectFiles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pdm/documents/project-files/', {
        params: { project_id: project.id }
      });
      
      const formattedFiles = response.data.map((file: any) => {
        const modifiedDate = new Date(file.modificado);
        const formattedDate = modifiedDate.toLocaleDateString('pt-BR') + ' at ' + modifiedDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        return {
          nome: file.nome,
          name: file.nome,
          version: "v1",
          release: "In Progress",
          status: "Checked In",
          modified: formattedDate,
          tamanho: file.tamanho,
          extensao: file.extensao,
          caminho_relativo: file.caminho_relativo
        };
      });
      
      setProjectFiles(formattedFiles || []);
    } catch (error) {
      console.error("Erro ao buscar arquivos do projeto:", error);
      setProjectFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project.id) {
      fetchProjectFiles();
    }
  }, [project.id]);

  const handleUpload = async (files: File[], comment: string) => {
    console.log("Uploading files:", files, "with comment:", comment);
    
    try {
      // Usaremos o PDMService no backend via API
      // Precisamos enviar cada arquivo. O endpoint create aceita arquivo.
      const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append('projeto', project.id);
        formData.append('nome', file.name);
        formData.append('arquivo', file);
        formData.append('tipo', 'CAD'); // Simplificado
        formData.append('caminho_relativo', file.name); // No web root por enquanto
        formData.append('comentario', comment);
        
        return api.post('/pdm/documents/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      });

      await Promise.all(uploadPromises);
      
      // Refresh list
      await fetchProjectFiles();
    } catch (error: any) {
      console.error("Erro no upload:", error);
      throw error; // Repassa para o modal mostrar erro
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.toLowerCase().split('.').pop();
    switch (ext) {
      case 'sldprt':
        return <IoCube className="h-4 w-4 text-primary opacity-90" />;
      case 'sldasm':
        return <FaCubes className="h-4 w-4 text-primary opacity-90" />;
      case 'slddrw':
        return <TbCubeUnfolded className="h-4 w-4 text-primary fill-primary/20 opacity-90" />;
      default:
        return <FileText className="h-4 w-4 text-primary fill-primary/20 opacity-90" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* breadcrumb header */}
      <div className="h-10 flex items-center px-6 border-b border-border/40 bg-[#050505] shrink-0">
         <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <FolderOpen className="h-3 w-3" />
            <span>Projects</span>
            <span className="opacity-30">/</span>
            <span className="text-foreground">{(project as any).nome || project.name}</span>
         </div>
      </div>
      
      {/* Primary Header as requested from screenshot */}
      <div className="h-12 flex items-center justify-between px-6 border-b border-border/40 bg-[#0a0a0a] shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 border-b-2 border-primary pb-2 mt-2 -mb-2 h-full cursor-pointer">
            <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">Files</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-50 hover:opacity-100 cursor-pointer transition-opacity">
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Components</span>
            <HelpCircle className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-4 gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-secondary/30 hover:bg-secondary/50 rounded-lg"
          >
            <FolderPlus className="h-3.5 w-3.5" />
            New folder
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => setShowUpload(true)}
            className="h-8 px-4 gap-2 text-[10px] font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload files
          </Button>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-auto bg-[#050505] custom-scrollbar">
        {!selectedFile && projectFiles.length > 0 ? (
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-border/20">
                <thead className="sticky top-0 bg-[#050505] z-10">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-left">Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-left">Version</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-left">Release</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-left">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-left">Modified</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {projectFiles.map((file, idx) => (
                    <tr key={idx} className="group hover:bg-white/[0.02] transition-colors border-b border-border/20">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 flex items-center justify-center transition-colors">
                            {getFileIcon(file.name)}
                          </div>
                          <span className="text-xs font-medium text-foreground/90 group-hover:text-primary transition-colors cursor-pointer">
                            {file.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[11px] font-mono text-muted-foreground">{file.version}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="text-[9px] font-bold px-2 py-0 h-5 bg-secondary/20 border-border/40 text-muted-foreground">
                          {file.release}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 opacity-60" />
                          <span className="text-[11px] font-medium text-muted-foreground">{file.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[10px] text-muted-foreground/70">{file.modified}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-secondary/40">
                            <Info className="h-4 w-4" />
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-secondary/40">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-[#0a0a0a] border-border/40 text-foreground">
                              <DropdownMenuItem className="gap-2 text-xs py-2 cursor-pointer hover:bg-white/5 focus:bg-white/5">
                                <Pencil className="h-3.5 w-3.5" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-xs py-2 cursor-pointer hover:bg-white/5 focus:bg-white/5 text-primary">
                                <CheckCircle className="h-3.5 w-3.5" />
                                Submit release
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-xs py-2 cursor-pointer hover:bg-white/5 focus:bg-white/5">
                                <Download className="h-3.5 w-3.5" />
                                Download
                              </DropdownMenuItem>
                              <div className="h-px bg-border/40 my-1" />
                              <DropdownMenuItem className="gap-2 text-xs py-2 cursor-pointer hover:bg-destructive/10 text-destructive focus:bg-destructive/10">
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : !selectedFile ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[500px]">
            <div className="max-w-4xl w-full text-center space-y-12 animate-in fade-in duration-700">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter text-foreground flex items-center justify-center gap-3">
                  Welcome to <span className="text-primary italic">Sibe</span>
                </h1>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Control versions without leaving SolidWorks. Even offline.
                </p>
              </div>

              {/* Install Add-in Banner */}
              <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center text-left">
                <div className="w-full md:w-1/3 aspect-video bg-[#0c0c0c] rounded-2xl border border-border/40 overflow-hidden shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-60 flex items-center justify-center p-4">
                     <img src="/solidworks-preview.png" alt="Sibe for SolidWorks" className="max-w-full rounded-lg" />
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-bold tracking-tight text-foreground">Install SolidWorks Add-in for native version control</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Install the Sibe Add-in for SolidWorks to control versions without leaving your environment. 
                    All files cached locally on device so you can work uninterrupted. 
                    Request a free onboarding call with Ken, our SolidWorks Champion, to show you how.
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest h-10 px-6 bg-secondary/50 rounded-full border border-border/40">
                      Request onboarding call
                    </Button>
                    <Button variant="default" className="text-xs font-bold uppercase tracking-widest h-10 px-6 bg-primary rounded-full">
                      Check available Add-ins
                    </Button>
                  </div>
                </div>
              </div>

              {/* Feature Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[ 
                  { id: 1, title: "Bring all your workspace into one place", desc: "Upload CAD formats like SolidWorks, STEP, and more..." },
                  { id: 2, title: "Pin comments on 3D and 2D designs", desc: "Run design reviews and capture feedback in any browser on any device." },
                  { id: 3, title: "Invite your teammates and partners", desc: "Work with teammates and partners. Share IP-protected designs externally." }
                ].map((feature) => (
                  <div key={feature.id} className="bg-[#0c0c0c] border border-border/40 rounded-3xl p-6 space-y-6 flex flex-col hover:border-primary/30 transition-all cursor-pointer group text-left">
                    <div className="w-full aspect-square bg-secondary/20 rounded-2xl flex items-center justify-center border border-border/20 group-hover:bg-primary/10 transition-colors">
                      <div className="relative">
                        {feature.id === 1 ? <Upload className="h-10 w-10 text-primary" /> : feature.id === 2 ? <div className="bg-secondary/80 border border-primary/40 px-2 py-1 text-[8px] font-mono text-foreground font-bold">V1: Initial Stage</div> : <Users className="h-10 w-10 text-primary opacity-40" /> }
                        <div className="absolute -top-1 -right-4 bg-primary text-[8px] font-bold text-primary-foreground px-1.5 py-0.5 rounded-full ring-2 ring-primary/20">{feature.id}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* File Viewer Mode */
          <div className="flex-1 flex overflow-hidden">
            <div className="w-[30%] border-r border-border/40 overflow-y-auto bg-[#0a0a0a]/50">
              <FileTree
                files={[]}
                onSelectFile={setSelectedFile}
                selectedPath={selectedFile?.path ?? null}
              />
            </div>
            <div className="flex-1 flex overflow-hidden">
              <ViewerPanel selectedFile={selectedFile} />
            </div>
          </div>
        )}
      </div>

      {showInvite && (
        <InviteModal projectName={project.name} onClose={() => setShowInvite(false)} />
      )}
      
      {showUpload && (
        <UploadModal 
          onClose={() => setShowUpload(false)} 
          onUpload={handleUpload} 
        />
      )}
    </div>
  );
}
