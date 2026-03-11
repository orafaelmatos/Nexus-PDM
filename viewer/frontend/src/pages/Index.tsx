import { useState, useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { ProjectSidebar } from "@/components/ProjectSidebar";
import { ProjectDashboard } from "@/components/ProjectDashboard";
import { CreateProjectModal } from "@/components/CreateProjectModal";
import { AuthPage } from "@/pages/AuthPage";
import type { Project } from "@/types/pdm";
import { FolderKanban, Plus, MoreVertical, LayoutGrid, Layers, Settings, Users, Folder } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem("access_token"));
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (authenticated) {
      fetchProjects();
    }
  }, [authenticated]);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects/");
      const data = Array.isArray(response.data) ? response.data : response.data.results;
      setProjects(data || []);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
      setProjects([]);
    }
  };

  const handleCreateProject = async (nome: string, descricao: string, isPublic: boolean) => {
    try {
      const response = await api.post("/projects/", { 
        nome, 
        descricao,
        projeto_publico: isPublic
      });
      const newProject = response.data;
      setProjects([newProject, ...projects]);
      setSelectedProject(newProject);
      setShowCreateProject(false);
      toast({
        title: "Projeto Criado",
        description: `O projeto ${nome} foi inicializado no workspace.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.error || "Erro ao criar projeto.",
        variant: "destructive",
      });
    }
  };

  if (!authenticated) {
    return <AuthPage onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <ProjectSidebar
          projects={projects}
          selectedProjectId={selectedProject?.id ?? null}
          onSelectProject={setSelectedProject}
          onCreateProject={() => setShowCreateProject(true)}
        />
        
        {selectedProject ? (
          <ProjectDashboard project={selectedProject} />
        ) : (
          /* Projects Table View - High Fidelity as requested from screenshot */
          <div className="flex-1 flex flex-col overflow-hidden bg-[#050505]">
            {/* Project List Header */}
            <div className="h-12 flex items-center justify-between px-8 border-b border-border/40 bg-[#0a0a0a] shrink-0">
              <h1 className="text-sm font-bold text-foreground tracking-tight">Projects</h1>
              <Button 
                onClick={() => setShowCreateProject(true)}
                className="h-8 px-4 gap-2 text-[10px] font-bold uppercase tracking-widest bg-secondary/50 hover:bg-secondary text-foreground border border-border/40 rounded-lg"
              >
                <Plus className="h-3.5 w-3.5" />
                New project
              </Button>
            </div>

            {/* Project Table */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[#050505] z-10 border-b border-border/40">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Name</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Created on</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <tr 
                        key={project.id} 
                        onClick={() => setSelectedProject(project)}
                        className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-secondary/30 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                              <Folder className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-bold text-foreground/90 group-hover:text-primary transition-colors">
                              {project.nome || project.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-xs text-muted-foreground">
                            on {project.createdAt ? new Date(project.createdAt).toLocaleDateString('pt-BR') : '21.01.2026'} at {project.createdAt ? new Date(project.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '14:06'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <FolderKanban className="h-10 w-10 text-muted-foreground/20" />
                          <p className="text-sm text-muted-foreground">Nenhum projeto encontrado no workspace.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showCreateProject && (
        <CreateProjectModal
          onClose={() => setShowCreateProject(false)}
          onCreate={handleCreateProject}
        />
      )}
    </div>
  );
};

export default Index;
