import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserType = 'arena' | 'atleta' | 'profissional' | null;

interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, type: UserType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, type: UserType) => {
    // Mock login
    setUser({
      id: '1',
      name: type === 'arena' ? 'Arena Premium' : type === 'atleta' ? 'João Silva' : 'Carlos Oliveira',
      email,
      type: type!,
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
