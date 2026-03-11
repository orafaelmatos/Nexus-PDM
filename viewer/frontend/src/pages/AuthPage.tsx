import { useState } from "react";
import { Box } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AuthPageProps {
  onLogin: () => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await api.post("/auth/login/", { email, password });
        console.log("Login OK, salvando tokens no localStorage...");
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        onLogin();
      } else {
        await api.post("/auth/register/", { 
          email, 
          password, 
          first_name: firstName, 
          last_name: lastName 
        });
        toast({
          title: "Conta criada",
          description: "Agora você pode entrar no sistema.",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.detail || "Erro de autenticação.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <Box className="h-8 w-8 text-primary mx-auto mb-3" />
          <h1 className="font-mono text-lg font-semibold tracking-wider text-foreground">
            CLOUD<span className="text-primary">PDM</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Gerenciamento de Dados</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border rounded-sm p-6 space-y-4">
          <h2 className="text-label text-center mb-4">{isLogin ? "Entrar" : "Criar Conta"}</h2>

          {!isLogin && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-label block mb-1.5">Nome</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border rounded-sm text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-label block mb-1.5">Sobrenome</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border rounded-sm text-sm"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-label block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-background border rounded-sm text-sm font-mono"
              required
            />
          </div>

          <div>
            <label className="text-label block mb-1.5">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-background border rounded-sm text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2.5 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-primary/90"
          >
            {isLogin ? "Entrar" : "Registrar"}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary underline">
              {isLogin ? "Registrar" : "Logar"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
