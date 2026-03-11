import { Search, Bell, Settings, User, Box } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2 mr-8">
          <Box className="h-5 w-5 text-primary" />
          <span className="font-mono text-sm font-bold tracking-tighter text-foreground">
            CLOUD<span className="text-primary italic">PDM</span>
          </span>
        </div>
        
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Pesquisar projetos, arquivos ou usuários..."
            className="w-full bg-secondary/30 border-none pl-9 h-9 text-sm focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full border border-background" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="h-4 w-4" />
        </Button>
        
        <div className="h-4 w-px bg-border mx-2" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full bg-secondary/50 p-0 hover:bg-secondary">
              <User className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.first_name || 'Usuário'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email || 'user@pdm.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configurações Workspace</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive font-medium" onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.reload();
            }}>
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
