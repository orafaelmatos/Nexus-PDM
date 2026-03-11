import { Plus, ChevronRight, LayoutGrid, Layers, Settings, Users, FolderKanban, FileText, Info, Puzzle } from "lucide-react";
import type { Project } from "@/types/pdm";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { useUser } from "@/hooks/use-user";

interface ProjectSidebarProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (project: Project | null) => void;
  onCreateProject: () => void;
}

export function ProjectSidebar({ projects, selectedProjectId, onSelectProject, onCreateProject }: ProjectSidebarProps) {
  const [activeNav, setActiveNav] = useState("projects");
  const { user } = useUser();

  const navItems = [
    { id: "projects", icon: LayoutGrid, label: "Projects" },
  ];

  // Obtém a inicial do usuário (primeira letra do primeiro nome)
  const userInitial = user?.first_name 
    ? user.first_name.charAt(0).toUpperCase() 
    : "K";

  return (
    <aside className="w-16 bg-[#050505] border-r border-border/40 flex flex-col items-center justify-between py-4 h-full">
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Logo / Home Button */}
        <button 
          onClick={() => onSelectProject(null)}
          className="w-10 h-10 rounded-xl bg-secondary/10 border border-border/40 flex items-center justify-center mb-4 text-foreground/80 hover:text-foreground transition-all hover:bg-secondary/20"
        >
          <span className="font-bold text-sm">{userInitial}</span>
          <ChevronRight className="h-2 w-2 ml-0.5 opacity-50" />
        </button>

        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveNav(item.id)}
                  className={`flex flex-col items-center group transition-all duration-200 ${
                    activeNav === item.id 
                      ? "text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className={`p-2 rounded-xl transition-all ${
                    activeNav === item.id 
                      ? "bg-[#1a1a1a] border border-border/60 shadow-[0_0_15px_rgba(255,255,255,0.05)]" 
                      : "group-hover:bg-secondary/20"
                  }`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs font-medium">{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      <div className="flex flex-col items-center gap-6 pb-2">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors group">
                <div className="p-2 rounded-xl group-hover:bg-secondary/20 transition-all">
                  <Puzzle className="h-5 w-5" />
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Add-Ins</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors group">
                <div className="p-2 rounded-xl group-hover:bg-secondary/20 transition-all">
                  <Settings className="h-5 w-5" />
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>

          {/* User Avatar Initial */}
          <div className="mt-2 group cursor-pointer">
            <div className="h-8 w-8 rounded-full border border-emerald-500/40 flex items-center justify-center bg-emerald-500/10 text-emerald-500 text-[10px] font-black transition-all group-hover:border-emerald-500/60 group-hover:bg-emerald-500/20">
              {userInitial}
            </div>
          </div>
        </TooltipProvider>
      </div>
    </aside>
  );
}
