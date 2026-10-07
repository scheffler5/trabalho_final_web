"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import {
  type DoctorUser, UF_LIST, PROFESSION_COUNCIL,
} from "@/lib/auth";
import {
  Eye, EyeOff, CheckCircle2, ArrowLeft, Stethoscope, Clock,
} from "lucide-react";

const PROFESSIONS = Object.keys(PROFESSION_COUNCIL);

const schema = z.object({
  name:            z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  email:           z.string().email("E-mail inválido"),
  phone:           z.string().optional(),
  profession:      z.string().min(1, "Selecione a profissão"),
  councilState:    z.string().min(1, "Selecione o estado"),
  councilNumber:   z
    .string()
    .regex(/^\d{4,8}$/, "Número deve ter entre 4 e 8 dígitos"),
  specialty:       z.string().optional(),
  password:        z.string().min(8, "Mínimo 8 caracteres"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function CadastroProfissionalPage() {
  const { register: registerUser } = useAuth();
  const [showPwd, setShowPwd]     = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [success, setSuccess]     = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register, handleSubmit, watch, control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const profession    = watch("profession");
  const councilPrefix = profession ? (PROFESSION_COUNCIL[profession] ?? "Conselho") : "Conselho";

  async function onSubmit(data: FormData) {
    setServerError("");
    const newUser: DoctorUser = {
      id:           `d_${Date.now()}`,
      name:         data.name,
      email:        data.email,
      password:     data.password,
      role:         "doctor",
      status:       "pending",  // aguarda aprovação do admin
      createdAt:    new Date().toISOString(),
      profession:   data.profession,
      council:      councilPrefix,
      councilState: data.councilState,
      councilNumber:data.councilNumber,
      specialty:    data.specialty || undefined,
      phone:        data.phone || undefined,
    };
    const result = registerUser(newUser);
    if (!result.ok) { setServerError(result.message); return; }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold">Cadastro enviado!</h2>
          <p className="text-muted-foreground">
            Seu cadastro foi registrado e está <strong>aguardando aprovação</strong> do
            administrador da clínica. Você receberá uma notificação quando for aprovado.
          </p>
          <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium mb-1">O que acontece agora?</p>
            <p>
              O administrador validará seu {councilPrefix} e aprovará o cadastro. Após
              aprovação, você poderá fazer login normalmente.
            </p>
          </div>
          <Link href="/login">
            <Button variant="outline" className="w-full">Ir para o login</Button>
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
          <div className="h-11 w-11 rounded-full bg-purple-100 flex items-center justify-center mb-3">
            <Stethoscope className="h-5 w-5 text-purple-600" />
          </div>
          <CardTitle className="text-2xl">Cadastro de Profissional</CardTitle>
          <CardDescription>
            Para médicos, enfermeiros, psicólogos e demais profissionais de saúde.
            O cadastro ficará pendente até aprovação pelo administrador.
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
              <Input placeholder="Dr. João da Silva" {...register("name")} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="E-mail" error={errors.email?.message}>
                <Input type="email" placeholder="joao@clinica.com"
                  autoComplete="email" {...register("email")} />
              </Field>
              <Field label="Telefone" error={errors.phone?.message}>
                <Input placeholder="(11) 99999-0000" {...register("phone")} />
              </Field>
            </div>

            {/* Profissão */}
            <Field label="Profissão" error={errors.profession?.message}>
              <Controller control={control} name="profession"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Selecione a profissão" /></SelectTrigger>
                    <SelectContent>
                      {PROFESSIONS.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )} />
            </Field>

            {/* CRM / COREN / etc. */}
            <div className="space-y-1.5">
              <Label>
                Registro no {councilPrefix}
                {profession && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    (detectado automaticamente)
                  </span>
                )}
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {/* Prefixo calculado automaticamente */}
                <div className="flex items-center justify-center bg-muted rounded-md border px-3 text-sm font-mono font-medium text-primary">
                  {councilPrefix}
                </div>

                {/* Estado */}
                <Field label="" error={errors.councilState?.message}>
                  <Controller control={control} name="councilState"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                        <SelectContent>
                          {UF_LIST.map((uf) => (
                            <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )} />
                </Field>

                {/* Número */}
                <Field label="" error={errors.councilNumber?.message}>
                  <Input placeholder="123456"
                    {...register("councilNumber")} className="font-mono" />
                </Field>
              </div>
              {(errors.councilState || errors.councilNumber) && (
                <p className="text-xs text-destructive">
                  {errors.councilState?.message || errors.councilNumber?.message}
                </p>
              )}
              {profession && (
                <p className="text-xs text-muted-foreground">
                  Exemplo: {councilPrefix}/SP 123456
                </p>
              )}
            </div>

            <Field label="Especialidade (opcional)" error={undefined}>
              <Input placeholder="Ex: Psiquiatria Adulto" {...register("specialty")} />
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

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-xs text-yellow-700">
              <strong>Atenção:</strong> seu cadastro passará por análise antes de ser ativado.
              O administrador verificará seu número de registro profissional.
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar cadastro"}
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
      {label && <Label>{label}</Label>}
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
