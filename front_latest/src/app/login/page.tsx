"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getRoleHome } from "@/lib/auth";
import { Brain, Eye, EyeOff, AlertCircle, Clock, XCircle } from "lucide-react";

const loginSchema = z.object({
  email:    z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
});
type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const { login } = useAuth();
  const router    = useRouter();
  const params    = useSearchParams();
  const from      = params.get("from");

  const [showPwd, setShowPwd] = useState(false);
  const [errorType, setErrorType] =
    useState<"invalid" | "pending" | "rejected" | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginFormData>({ resolver: zodResolver(loginSchema), mode: "onBlur" });

  async function onSubmit(data: LoginFormData) {
    setErrorType(null);
    const result = await login(data.email, data.password);
    if (!result.ok) {
      if      (result.reason === "pending")   setErrorType("pending");
      else if (result.reason === "rejected")  setErrorType("rejected");
      else                                    setErrorType("invalid");
      return;
    }
    router.push(from ?? getRoleHome(result.user.role));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Entrar na sua conta</CardTitle>
        <CardDescription>Acesse para gerenciar seus agendamentos</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorType === "invalid" && (
            <div className="flex items-start gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              E-mail ou senha incorretos.
            </div>
          )}
          {errorType === "pending" && (
            <div className="flex items-start gap-2 p-3 text-sm text-yellow-700 bg-yellow-50 rounded-md border border-yellow-200">
              <Clock className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Cadastro <strong>aguardando aprovação</strong> do administrador.
                Você será notificado em breve.
              </span>
            </div>
          )}
          {errorType === "rejected" && (
            <div className="flex items-start gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
              Cadastro reprovado. Entre em contato com a clínica.
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="seu@email.com"
              autoComplete="email" {...register("email")} aria-invalid={!!errors.email} />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input id="password" type={showPwd ? "text" : "password"}
                placeholder="••••••••" autoComplete="current-password"
                {...register("password")} aria-invalid={!!errors.password}
                className="pr-10" />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPwd ? "Ocultar" : "Mostrar"}>
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link href="/cadastro" className="text-primary hover:underline font-medium">
            Cadastre-se
          </Link>
        </p>

        <div className="mt-4 p-3 bg-muted/50 rounded-md">
          <p className="text-xs font-semibold text-muted-foreground mb-1.5">
            Credenciais de demonstração:
          </p>
          <div className="space-y-0.5 text-xs text-muted-foreground">
            <p>👤 <b>Paciente:</b> paciente@clinica.com / paciente123</p>
            <p>🩺 <b>Médico:</b> medico@clinica.com / medico123</p>
            <p>🔧 <b>Admin:</b> admin@clinica.com / admin123</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Brain className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">MenteSã</h1>
          <p className="text-sm text-muted-foreground">Área de Acesso</p>
        </div>
        <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}>
          <LoginForm />
        </Suspense>
        <p className="text-center text-sm text-muted-foreground">
          Precisa de ajuda?{" "}
          <Link href="/sobre" className="text-primary hover:underline">
            Fale conosco
          </Link>
        </p>
      </div>
    </div>
  );
}
