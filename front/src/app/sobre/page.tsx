import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  Heart,
  Shield,
  Award,
  Phone,
  Mail,
  MapPin,
  Clock,
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

const team = [
  { name: "Dra. Ana Carolina Mendes", role: "Diretora Clínica · Psiquiatria Adulto" },
  { name: "Dr. Roberto Faria", role: "Coordenador · Psiquiatria Infantojuvenil" },
  { name: "Dra. Fernanda Oliveira", role: "Psiquiatria Geriátrica" },
  { name: "Dr. Lucas Martins", role: "Psiquiatria Forense" },
];

export default function SobrePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-3">Nossa História</Badge>
        <h1 className="text-4xl font-bold mb-4">Sobre a MenteSã</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Há mais de 15 anos cuidando da saúde mental de milhares de pacientes,
          com responsabilidade, ciência e humanidade.
        </p>
      </div>

      {/* Mission */}
      <section className="mb-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Nossa Missão</h2>
            <p className="text-muted-foreground mb-4">
              A Clínica Psiquiátrica MenteSã nasceu do desejo de oferecer cuidado
              de saúde mental de alta qualidade de forma acessível e humanizada.
            </p>
            <p className="text-muted-foreground mb-4">
              Acreditamos que saúde mental é parte fundamental do bem-estar geral
              e que toda pessoa merece ter acesso a um tratamento digno,
              respeitoso e embasado nas melhores práticas da medicina.
            </p>
            <p className="text-muted-foreground">
              Nossa equipe de psiquiatras experientes está comprometida com o
              acompanhamento longitudinal dos pacientes, garantindo continuidade
              e qualidade no tratamento.
            </p>
          </div>
          <div className="bg-primary/5 rounded-2xl p-8 text-center">
            <Brain className="h-16 w-16 text-primary mx-auto mb-4" />
            <blockquote className="text-lg italic text-foreground font-medium">
              "Cuidar da mente é cuidar de toda a vida."
            </blockquote>
            <p className="text-sm text-muted-foreground mt-2">— Fundadores da MenteSã</p>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Values */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Nossos Valores</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {values.map((v) => (
            <Card key={v.title} className="bg-muted/30 border-0">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <v.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{v.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      {/* Team */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Equipe de Liderança</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {team.map((member) => (
            <div key={member.name} className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      {/* Contact */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">Localização e Contato</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Phone, label: "Telefone", value: "(11) 3456-7890" },
            { icon: Mail, label: "E-mail", value: "contato@mentesa.com.br" },
            { icon: MapPin, label: "Endereço", value: "Av. Paulista, 1000 — SP" },
            { icon: Clock, label: "Horário", value: "Seg–Sex 08h–19h" },
          ].map((c) => (
            <Card key={c.label} className="text-center p-4">
              <c.icon className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{c.label}</p>
              <p className="text-sm font-medium">{c.value}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
