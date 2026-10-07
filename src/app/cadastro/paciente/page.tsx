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
import type { PatientUser } from "@/lib/auth";
import { Eye, EyeOff, CheckCircle2, ArrowLeft, User } from "lucide-react";

const schema = z.object({
  name:            z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  email:           z.string().email("E-mail inválido"),
  phone:           z.string().min(10, "Telefone inválido").optional().or(z.literal("")),
  dateOfBirth:     z.string().min(1, "Informe sua data de nascimento"),
  cpf:             z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido — formato: 000.000.000-00"),
  password:        z.string().min(8, "Mínimo 8 caracteres"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function CadastroPacientePage() {
  const { register: registerUser } = useAuth();
  const [showPwd, setShowPwd]     = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [success, setSuccess]     = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register, handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError("");
    const newUser: PatientUser = {
      id:          `p_${Date.now()}`,
      name:        data.name,
      email:       data.email,
      password:    data.password,
      role:        "patient",
      status:      "approved",   // pacientes têm acesso imediato
      createdAt:   new Date().toISOString(),
      cpf:         data.cpf,
      dateOfBirth: data.dateOfBirth,
      phone:       data.phone || undefined,
    };
    const result = registerUser(newUser);
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
          <h2 className="text-2xl font-bold">Cadastro realizado!</h2>
          <p className="text-muted-foreground">
            Sua conta foi criada com sucesso. Você já pode acessar a plataforma.
          </p>
          <Link href="/login">
            <Button className="mt-2 w-full">Ir para o login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-lg">
      <Link href="/cadastro"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <Card>
        <CardHeader>
          <div className="h-11 w-11 rounded-full bg-blue-100 flex items-center justify-center mb-3">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Cadastro de Paciente</CardTitle>
          <CardDescription>
            Crie sua conta para acessar o sistema de agendamento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {serverError}
              </p>
            )}

            <Field label="Nome completo" error={errors.name?.message}>
              <Input placeholder="Maria da Silva" {...register("name")} />
            </Field>

            <Field label="E-mail" error={errors.email?.message}>
              <Input type="email" placeholder="seu@email.com"
                autoComplete="email" {...register("email")} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Data de nascimento" error={errors.dateOfBirth?.message}>
                <Input type="date" {...register("dateOfBirth")} />
              </Field>
              <Field label="Telefone" error={errors.phone?.message}>
                <Input placeholder="(11) 99999-0000" {...register("phone")} />
              </Field>
            </div>

            <Field label="CPF" error={errors.cpf?.message}>
              <Input placeholder="000.000.000-00" {...register("cpf")} />
            </Field>

            <Field label="Senha" error={errors.password?.message}>
              <PasswordInput
                id="pwd" show={showPwd} onToggle={() => setShowPwd(v => !v)}
                placeholder="Mínimo 8 caracteres"
                {...register("password")} />
            </Field>

            <Field label="Confirmar senha" error={errors.confirmPassword?.message}>
              <PasswordInput
                id="conf" show={showConf} onToggle={() => setShowConf(v => !v)}
                placeholder="Repita a senha"
                {...register("confirmPassword")} />
            </Field>

            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link href="/login" className="text-primary hover:underline">Entrar</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, error, children }: {
  label: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

const PasswordInput = ({
  id, show, onToggle, placeholder, ...rest
}: {
  id: string; show: boolean; onToggle: () => void; placeholder?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="relative">
    <Input id={id} type={show ? "text" : "password"}
      placeholder={placeholder} className="pr-10" {...rest} />
    <button type="button" onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  </div>
);
