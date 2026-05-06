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
  | { type: 'arena'; name: string; email: string; password: string; cpf: string; dataNascimento: string; nomeArena: string; cnpj: string }
  | { type: 'atleta'; name: string; email: string; password: string; cpf: string; dataNascimento: string; apelido: string }
  | { type: 'profissional'; name: string; email: string; password: string; cpf: string; dataNascimento: string; especialidade: string; valorHora: number };

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, type: UserType, remember?: boolean) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ message: string; token?: string }>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyIdentity: (cpf: string, dataNascimento: string, email: string) => Promise<{ message: string; token: string; userId: number }>;
  resetPasswordWithVerification: (userId: number, newPassword: string) => Promise<{ message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

  useEffect(() => {
    const storedUser = localStorage.getItem('sportconnect:user') || sessionStorage.getItem('sportconnect:user');
    const storedToken = localStorage.getItem('sportconnect:token') || sessionStorage.getItem('sportconnect:token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser) as User);
        setToken(storedToken);
      } catch {
        localStorage.removeItem('sportconnect:user');
        localStorage.removeItem('sportconnect:token');
        sessionStorage.removeItem('sportconnect:user');
        sessionStorage.removeItem('sportconnect:token');
      }
    }
  }, []);

  const login = async (email: string, password: string, type: UserType, remember: boolean = false) => {
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
    
    // Permitir que o administrador master acesse todos os 3 portais (arena, atleta, profissional)
    const isMasterAdmin = apiUser.email.toLowerCase() === 'admin@sportconnect.com';
    const finalType = isMasterAdmin && type ? type : mappedType;

    if (!isMasterAdmin && type && mappedType !== type) {
      throw new Error('Tipo de usuário inválido para estas credenciais');
    }

    const nextUser = {
      id: apiUser.id,
      name: apiUser.name,
      email: apiUser.email,
      type: finalType,
    };

    setUser(nextUser);
    setToken(data.token);

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('sportconnect:user', JSON.stringify(nextUser));
    storage.setItem('sportconnect:token', data.token);
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
    await login(data.email, data.password, data.type, true);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sportconnect:user');
    localStorage.removeItem('sportconnect:token');
    sessionStorage.removeItem('sportconnect:user');
    sessionStorage.removeItem('sportconnect:token');
  };

  const forgotPassword = async (email: string) => {
    const response = await fetch(`${apiBase}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || 'Falha ao solicitar recuperação de senha');
    }
    return data;
  };

  const resetPassword = async (token: string, password: string) => {
    const response = await fetch(`${apiBase}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || 'Falha ao redefinir senha');
    }
  };

  const verifyIdentity = async (cpf: string, dataNascimento: string, email: string) => {
    const response = await fetch(`${apiBase}/auth/verify-identity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, dataNascimento, email }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || 'Falha ao verificar identidade');
    }
    return data;
  };

  const resetPasswordWithVerification = async (userId: number, newPassword: string) => {
    const response = await fetch(`${apiBase}/auth/reset-password-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newPassword }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || 'Falha ao redefinir senha');
    }
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, forgotPassword, resetPassword, verifyIdentity, resetPasswordWithVerification }}>
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
