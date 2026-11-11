"use client";

import { useState } from "react";
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
import { type AdminUser, ADMIN_REGISTER_CODE } from "@/lib/auth";
import {
  Eye, EyeOff, CheckCircle2, ArrowLeft, ShieldCheck, Lock,
} from "lucide-react";

const schema = z.object({
  accessCode:      z.string().min(1, "Código obrigatório"),
  name:            z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  email:           z.string().email("E-mail inválido"),
  password:        z.string().min(8, "Mínimo 8 caracteres"),
  confirmPassword: z.string(),
}).refine((d) => d.accessCode === ADMIN_REGISTER_CODE, {
  message: "Código de acesso inválido",
  path: ["accessCode"],
}).refine((d) => d.password === d.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function AdminRegistroPage() {
  const { register: registerUser } = useAuth();
  const [showPwd, setShowPwd]     = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [showCode, setShowCode]   = useState(false);
  const [success, setSuccess]     = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register, handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError("");
    const newAdmin: AdminUser = {
      id:        `a_${Date.now()}`,
      name:      data.name,
      email:     data.email,
      password:  data.password,
      role:      "admin",
      status:    "approved",
      createdAt: new Date().toISOString(),
    };
    const result = registerUser(newAdmin);
    if (!result.ok) { setServerError(result.message); return; }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Administrador criado!</h2>
          <p className="text-muted-foreground">
            A conta administrativa foi criada com sucesso.
          </p>
          <Link href="/login">
            <Button className="w-full">Ir para o login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <Link href="/cadastro"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <Card className="border-orange-200">
          <CardHeader>
            <div className="h-11 w-11 rounded-full bg-orange-100 flex items-center justify-center mb-3">
              <ShieldCheck className="h-5 w-5 text-orange-600" />
            </div>
            <CardTitle className="text-2xl">Acesso Administrativo</CardTitle>
            <CardDescription>
              Área restrita. Insira o código de acesso fornecido pela
              gestão da clínica para criar uma conta de administrador.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {serverError && (
                <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {serverError}
                </p>
              )}

              {/* Código de acesso */}
              <div className="space-y-1.5">
                <Label htmlFor="code" className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" /> Código de acesso
                </Label>
                <div className="relative">
                  <Input
                    id="code"
                    type={showCode ? "text" : "password"}
                    placeholder="••••••••••••"
                    {...register("accessCode")}
                    className="pr-10 font-mono tracking-widest"
                    aria-invalid={!!errors.accessCode}
                  />
                  <button type="button" onClick={() => setShowCode(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.accessCode && (
                  <p className="text-xs text-destructive">{errors.accessCode.message}</p>
                )}
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input id="name" placeholder="Nome do administrador"
                    {...register("name")} />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="admin@clinica.com"
                    autoComplete="email" {...register("email")} />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pwd">Senha</Label>
                  <div className="relative">
                    <Input id="pwd" type={showPwd ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres" className="pr-10"
                      {...register("password")} />
                    <button type="button" onClick={() => setShowPwd(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="conf">Confirmar senha</Label>
                  <div className="relative">
                    <Input id="conf" type={showConf ? "text" : "password"}
                      placeholder="Repita a senha" className="pr-10"
                      {...register("confirmPassword")} />
                    <button type="button" onClick={() => setShowConf(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showConf ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Criando conta..." : "Criar conta administrativa"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Código padrão de demonstração:{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs">MENTESA2025</code>
        </p>
      </div>
    </div>
  );
}
