import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User, Stethoscope, ShieldCheck, ArrowRight, Brain,
} from "lucide-react";

export const metadata = { title: "Cadastro — MenteSã" };

export default function CadastroPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="relative h-48 overflow-hidden rounded-3xl shadow-md">
          <Image
            src="/images/cadastro-meditacao.jpg"
            alt="Pessoa meditando ao pôr do sol"
            fill
            preload
            sizes="(max-width: 768px) 100vw, 672px"
            className="object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/30" />
          <div className="relative flex h-full flex-col justify-center p-8 text-primary-foreground">
            <Brain className="h-8 w-8 mb-3 opacity-90" />
            <h1 className="text-3xl font-bold mb-1">Criar sua conta</h1>
            <p className="text-primary-foreground/85">
              Escolha o tipo de acesso que melhor representa você.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {/* PACIENTE */}
          <Card className="group border-2 hover:border-primary transition-colors cursor-pointer">
            <Link href="/cadastro/paciente" className="block h-full">
              <CardHeader className="pb-3">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                  <User className="h-6 w-6 text-primary group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="text-xl">Sou Paciente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Crie sua conta para agendar consultas, acompanhar seu histórico
                  e gerenciar seus atendimentos.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Acesso imediato após cadastro
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Agendamento online 24h
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Histórico de consultas
                  </li>
                </ul>
                <Button className="w-full gap-2">
                  Cadastrar como Paciente <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Link>
          </Card>

          {/* PROFISSIONAL */}
          <Card className="group border-2 hover:border-primary transition-colors cursor-pointer">
            <Link href="/cadastro/profissional" className="block h-full">
              <CardHeader className="pb-3">
                <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                  <Stethoscope className="h-6 w-6 text-accent-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="text-xl">Sou Profissional</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Cadastro para médicos, enfermeiros, psicólogos e demais
                  profissionais de saúde da clínica.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-500">⏳</span> Cadastro sujeito à aprovação
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Validação de CRM / CRP
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Gestão de agenda e pacientes
                  </li>
                </ul>
                <Button className="w-full gap-2" variant="outline">
                  Cadastrar como Profissional <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Fazer login
            </Link>
          </p>
          <Link
            href="/admin/registro"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-muted-foreground/70 transition-colors"
          >
            <ShieldCheck className="h-3 w-3" />
            Acesso Administrativo
          </Link>
        </div>
      </div>
    </div>
  );
}
