 "use client";
import React, { createContext, useContext, useState } from "react";

type User = { name: string } | null;

type AuthContextValue = {
  user: User;
  login: (u: NonNullable<User>) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const login = (u: NonNullable<User>) => setUser(u);
  const logout = () => setUser(null);
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
