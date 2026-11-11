import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FeaturedDoctors from "@/components/FeaturedDoctors";
import {
  Brain,
  Calendar,
  Shield,
  Clock,
  Star,
  ArrowRight,
  Heart,
  Users,
  Award,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Agendamento Online",
    desc: "Marque sua consulta de forma rápida e segura, 24 horas por dia.",
  },
  {
    icon: Shield,
    title: "Sigilo Garantido",
    desc: "Seus dados e histórico clínico são protegidos com total confidencialidade.",
  },
  {
    icon: Clock,
    title: "Pontualidade",
    desc: "Respeitamos o seu tempo. Consultas iniciadas no horário agendado.",
  },
  {
    icon: Heart,
    title: "Cuidado Humanizado",
    desc: "Atendimento acolhedor que coloca o bem-estar do paciente em primeiro lugar.",
  },
];

const stats = [
  { icon: Users, value: "2.000+", label: "Pacientes atendidos" },
  { icon: Award, value: "15+", label: "Anos de experiência" },
  { icon: Star, value: "4.9", label: "Avaliação média" },
  { icon: Brain, value: "8", label: "Especialistas" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-accent/60 py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <Badge className="mb-4" variant="secondary">
              Clínica Psiquiátrica de Referência
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
              Cuidando da sua{" "}
              <span className="text-primary">saúde mental</span>{" "}
              com excelência
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              Agende sua consulta com especialistas renomados em psiquiatria. Um
              atendimento humanizado e confidencial para o seu bem-estar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  Agendar Consulta <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/medicos">
                <Button size="lg" variant="outline">
                  Conhecer Médicos
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-4 rounded-[2rem] bg-primary/15 rotate-3" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-xl">
              <Image
                src="/images/home-amanhecer.jpg"
                alt="Amanhecer sereno sobre um campo verde"
                fill
                preload
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                <Heart className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">Acolhimento</p>
                <p className="text-xs text-muted-foreground">em cada consulta</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <s.icon className="h-6 w-6 mb-1 opacity-80" />
                <span className="text-3xl font-bold">{s.value}</span>
                <span className="text-sm opacity-80">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Por que escolher a MenteSã?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Oferecemos uma experiência completa no cuidado da saúde mental, do
              agendamento ao acompanhamento contínuo.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="text-center border-0 shadow-sm bg-muted/30">
                <CardHeader className="pb-2">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured doctors */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-1">Nossos Especialistas</h2>
              <p className="text-muted-foreground">
                Conheça parte da nossa equipe médica
              </p>
            </div>
            <Link href="/medicos">
              <Button variant="outline" className="hidden sm:flex gap-2">
                Ver todos <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <FeaturedDoctors />

          <div className="mt-6 text-center sm:hidden">
            <Link href="/medicos">
              <Button variant="outline" className="gap-2">
                Ver todos os médicos <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para cuidar da sua saúde mental?
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Crie sua conta e agende sua primeira consulta hoje mesmo. O primeiro
            passo é o mais importante.
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="gap-2">
              Começar agora <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
