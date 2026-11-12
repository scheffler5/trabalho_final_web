"use client";

import {
  createContext, useContext, useState, useEffect, ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api, setToken, clearToken } from "@/lib/api";

export type UserRole   = "patient" | "doctor" | "admin";
export type UserStatus = "pending" | "approved" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  phone?: string;
  cpf?: string;
  dateOfBirth?: string;
  profession?: string;
  council?: string;
  councilState?: string;
  councilNumber?: string;
  specialty?: string;
}

type LoginResult =
  | { ok: true;  user: User }
  | { ok: false; reason: "invalid_credentials" | "pending" | "rejected" | "error"; message?: string };

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login(email: string, password: string): Promise<LoginResult>;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]         = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  // Restaura sessão ao montar
  useEffect(() => {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("clinica_token")
      : null;

    if (!token) { setLoading(false); return; }

    api<User>("/users/me")
      .then((u) => setUser(u))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string): Promise<LoginResult> {
    try {
      const res = await api<{ access_token: string; user: User }>(
        "/auth/login",
        { method: "POST", body: JSON.stringify({ email, password }) },
      );
      setToken(res.access_token);
      setUser(res.user);
      return { ok: true, user: res.user };
    } catch (err: any) {
      const msg: string = err.message || "";
      if (msg.includes("aprovação"))   return { ok: false, reason: "pending",              message: msg };
      if (msg.includes("reprovado"))   return { ok: false, reason: "rejected",             message: msg };
      if (msg.includes("inválid"))     return { ok: false, reason: "invalid_credentials",  message: msg };
      return { ok: false, reason: "error", message: msg };
    }
  }

  function logout() {
    clearToken();
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
