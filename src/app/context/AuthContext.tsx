import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type UserType = 'arena' | 'atleta' | 'profissional' | 'admin' | null;
type ApiRole = 'ARENA' | 'ATLETA' | 'PROFISSIONAL';

interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  isComplete?: boolean;
}

type RegisterData =
  | { type: 'arena'; name: string; email: string; password: string; cpf: string; dataNascimento: string; nomeArena: string; cnpj: string }
  | { type: 'atleta'; name: string; email: string; password: string; cpf: string; dataNascimento: string; apelido: string }
  | { type: 'profissional'; name: string; email: string; password: string; cpf: string; dataNascimento: string; especialidade: string; valorHora: number };

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  login: (email: string, password: string, type: UserType, remember?: boolean) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ message: string; token?: string }>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyIdentity: (cpf: string, dataNascimento: string, email: string) => Promise<{ message: string; token: string; userId: number }>;
  resetPasswordWithVerification: (userId: number, newPassword: string) => Promise<{ message: string }>;
  loginWithGoogle: (credential: string, type: UserType) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || '';
  const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

  const isAdmin = !!user && user.email.toLowerCase() === adminEmail.toLowerCase();

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
    const isMasterAdmin = apiUser.email.toLowerCase() === adminEmail.toLowerCase();
    const finalType: UserType = isMasterAdmin ? 'admin' : mappedType;

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

  const loginWithGoogle = async (credential: string, type: UserType) => {
    const response = await fetch(`${apiBase}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential, role: type }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || 'Falha ao autenticar com o Google');
    }

    const apiUser = data.user as { id: string; name: string; email: string; role: ApiRole; isComplete?: boolean };
    const mappedType = apiUser.role.toLowerCase() as UserType;

    const nextUser = {
      id: apiUser.id,
      name: apiUser.name,
      email: apiUser.email,
      type: mappedType,
      isComplete: apiUser.isComplete,
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
    <AuthContext.Provider value={{ user, token, isAdmin, login, register, logout, forgotPassword, resetPassword, verifyIdentity, resetPasswordWithVerification, loginWithGoogle }}>
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
