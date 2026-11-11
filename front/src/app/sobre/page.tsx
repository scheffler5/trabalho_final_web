import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Heart,
  Shield,
  Award,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Users,
  Star,
} from "lucide-react";

export const metadata = {
  title: "Sobre Nós — MenteSã",
};

const values = [
  {
    icon: Heart,
    title: "Humanização",
    desc: "Cada paciente é único. Oferecemos um atendimento personalizado e acolhedor.",
  },
  {
    icon: Shield,
    title: "Ética e Sigilo",
    desc: "Cumprimos rigorosamente o Código de Ética Médica e o sigilo profissional.",
  },
  {
    icon: Award,
    title: "Excelência",
    desc: "Profissionais em constante atualização para oferecer os melhores tratamentos.",
  },
  {
    icon: Brain,
    title: "Ciência",
    desc: "Tratamentos baseados em evidências científicas e protocolos internacionais.",
  },
];

const stats = [
  { icon: Users, value: "2.000+", label: "Pacientes atendidos" },
  { icon: Award, value: "15+",    label: "Anos de história" },
  { icon: Star,  value: "4.9",    label: "Avaliação média" },
];

const contacts = [
  { icon: Phone,  label: "Telefone", value: "(11) 3456-7890" },
  { icon: Mail,   label: "E-mail",   value: "contato@mentesa.com.br" },
  { icon: MapPin, label: "Endereço", value: "Av. Paulista, 1000 — SP" },
  { icon: Clock,  label: "Horário",  value: "Seg–Sex 08h–19h" },
];

function initials(name: string) {
  return name.replace(/^Dra?\.\s*/, "").split(" ").filter(Boolean)
    .slice(0, 2).map(p => p[0]).join("");
}

const team = [
  { name: "Dra. Ana Carolina Mendes", role: "Diretora Clínica · Psiquiatria Adulto" },
  { name: "Dr. Roberto Faria", role: "Coordenador · Psiquiatria Infantojuvenil" },
  { name: "Dra. Fernanda Oliveira", role: "Psiquiatria Geriátrica" },
  { name: "Dr. Lucas Martins", role: "Psiquiatria Forense" },
];

export default function SobrePage() {
  return (
    <div className="flex flex-col">
      {/* Hero: texto + foto */}
      <section className="bg-gradient-to-br from-secondary via-background to-accent/60 px-4 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <Badge variant="secondary" className="mb-4">Nossa História</Badge>
            <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">
              Sobre a <span className="text-primary">MenteSã</span>
            </h1>
            <p className="mb-8 max-w-xl text-lg text-muted-foreground">
              Há mais de 15 anos cuidando da saúde mental de milhares de pacientes,
              com responsabilidade, ciência e humanidade.
            </p>
            <div className="grid max-w-md grid-cols-3 gap-4">
              {stats.map(s => (
                <div key={s.label} className="rounded-2xl bg-card p-4 shadow-sm">
                  <s.icon className="mb-2 h-5 w-5 text-primary" />
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-xl">
            <Image
              src="/images/sobre-ambiente.jpg"
              alt="Sala clara e tranquila, com luz natural"
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
            <p className="absolute bottom-5 left-6 text-sm font-medium text-white">
              Um espaço pensado para o seu conforto
            </p>
          </div>
        </div>
      </section>

      {/* Missão: foto + texto */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="relative order-last aspect-[4/3] overflow-hidden rounded-[2rem] shadow-md lg:order-first">
            <Image
              src="/images/sobre-cuidado.jpg"
              alt="Médica fazendo anotações ao lado de um estetoscópio"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="mb-5 text-3xl font-bold">Nossa Missão</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                A Clínica Psiquiátrica MenteSã nasceu do desejo de oferecer cuidado
                de saúde mental de alta qualidade de forma acessível e humanizada.
              </p>
              <p>
                Acreditamos que saúde mental é parte fundamental do bem-estar geral
                e que toda pessoa merece ter acesso a um tratamento digno,
                respeitoso e embasado nas melhores práticas da medicina.
              </p>
              <p>
                Nossa equipe de psiquiatras experientes está comprometida com o
                acompanhamento longitudinal dos pacientes, garantindo continuidade
                e qualidade no tratamento.
              </p>
            </div>
            <blockquote className="mt-8 rounded-2xl border-l-4 border-primary bg-secondary/60 p-6">
              <p className="text-lg font-medium italic">
                “Cuidar da mente é cuidar de toda a vida.”
              </p>
              <footer className="mt-2 text-sm text-muted-foreground">— Fundadores da MenteSã</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Valores: faixa colorida, 4 colunas */}
      <section className="bg-secondary/50 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <h2 className="mb-3 text-3xl font-bold">Nossos Valores</h2>
            <p className="text-muted-foreground">
              Os princípios que guiam cada atendimento na MenteSã.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(v => (
              <Card key={v.title} className="border-0 shadow-sm transition-transform hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <v.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-base">{v.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Equipe: 4 colunas */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <h2 className="mb-3 text-3xl font-bold">Equipe de Liderança</h2>
            <p className="text-muted-foreground">
              Profissionais experientes à frente do cuidado clínico.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map(m => (
              <div key={m.name} className="flex flex-col items-center rounded-2xl border bg-card p-6 text-center shadow-sm">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-chart-2 text-2xl font-bold text-primary-foreground">
                  {initials(m.name)}
                </div>
                <p className="font-semibold">{m.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contato: cards + chamada */}
      <section className="px-4 pb-20">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
            {contacts.map(c => (
              <Card key={c.label} className="flex-row items-center gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</p>
                  <p className="text-sm font-medium">{c.value}</p>
                </div>
              </Card>
            ))}
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-primary p-8 text-primary-foreground lg:col-span-2">
            <h2 className="mb-2 text-2xl font-bold">Vamos conversar?</h2>
            <p className="mb-6 text-primary-foreground/80">
              Agende sua primeira consulta e dê o primeiro passo no seu cuidado.
            </p>
            <Link href="/login">
              <Button variant="secondary" className="gap-2">
                Agendar consulta <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
