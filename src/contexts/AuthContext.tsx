"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type User,
  type UserRole,
  findApprovedUser,
  findUserByEmail,
  getUserFromStorage,
  setUserInStorage,
  clearUserFromStorage,
  getRoleHome,
  registerUser,
} from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  register: (newUser: User) => { ok: boolean; message: string };
}

export type LoginResult =
  | { ok: true; user: User }
  | { ok: false; reason: "invalid_credentials" | "pending" | "rejected" };

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]         = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setUser(getUserFromStorage());
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string): Promise<LoginResult> {
    // First check if user exists at all
    const found = findUserByEmail(email);
    if (!found || found.password !== password) {
      return { ok: false, reason: "invalid_credentials" };
    }
    if (found.status === "pending") {
      return { ok: false, reason: "pending" };
    }
    if (found.status === "rejected") {
      return { ok: false, reason: "rejected" };
    }
    // approved
    setUserInStorage(found);
    setUser(found);
    return { ok: true, user: found };
  }

  function logout() {
    clearUserFromStorage();
    setUser(null);
    router.push("/login");
  }

  function register(newUser: User) {
    return registerUser(newUser);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
