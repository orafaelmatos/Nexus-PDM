import { useState, useEffect } from "react";
import api from "@/lib/api";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me/");
        setUser(response.data);
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err);
        setError(err instanceof Error ? err : new Error("Erro desconhecido"));
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem("access_token")) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  return { user, loading, error };
}
