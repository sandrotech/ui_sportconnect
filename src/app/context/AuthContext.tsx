import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type UserType = 'arena' | 'atleta' | 'profissional' | null;
type ApiRole = 'ARENA' | 'ATLETA' | 'PROFISSIONAL';

interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
}

type RegisterData =
  | { type: 'arena'; name: string; email: string; password: string; nomeArena: string; cnpj: string }
  | { type: 'atleta'; name: string; email: string; password: string; apelido: string }
  | { type: 'profissional'; name: string; email: string; password: string; especialidade: string; valorHora: number };

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, type: UserType) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

  useEffect(() => {
    const storedUser = localStorage.getItem('sportconnect:user');
    const storedToken = localStorage.getItem('sportconnect:token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser) as User);
        setToken(storedToken);
      } catch {
        localStorage.removeItem('sportconnect:user');
        localStorage.removeItem('sportconnect:token');
      }
    }
  }, []);

  const login = async (email: string, password: string, type: UserType) => {
    const response = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || 'Falha ao autenticar');
    }

    const apiUser = data.user as { id: string; name: string; email: string; role: ApiRole };
    const mappedType = apiUser.role.toLowerCase() as UserType;
    if (type && mappedType !== type) {
      throw new Error('Tipo de usuário inválido para estas credenciais');
    }

    const nextUser = {
      id: apiUser.id,
      name: apiUser.name,
      email: apiUser.email,
      type: mappedType,
    };

    setUser(nextUser);
    setToken(data.token);
    localStorage.setItem('sportconnect:user', JSON.stringify(nextUser));
    localStorage.setItem('sportconnect:token', data.token);
  };

  const register = async (data: RegisterData) => {
    const response = await fetch(`${apiBase}/auth/register/${data.type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error || 'Falha ao cadastrar');
    }
    await login(data.email, data.password, data.type);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sportconnect:user');
    localStorage.removeItem('sportconnect:token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
