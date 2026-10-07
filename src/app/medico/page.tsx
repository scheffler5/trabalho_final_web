"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_APPOINTMENTS } from "@/lib/data";
import type { DoctorUser } from "@/lib/auth";
import {
  CalendarDays, CheckCircle2, Clock, Users,
  Stethoscope, LogOut, Award, Phone,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function MedicoDashboardPage() {
  const { user, logout } = useAuth();
  const doc = user as DoctorUser;

  // Filtra consultas "do médico" (simulação — usa os mocks globais)
  const upcoming  = MOCK_APPOINTMENTS.filter(a => a.status === "scheduled");
  const completed = MOCK_APPOINTMENTS.filter(a => a.status === "completed");
  const next      = upcoming[0];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
            <Stethoscope className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Painel do Médico</h1>
            <p className="text-sm text-muted-foreground">
              {doc?.name} · {doc?.council}/{doc?.councilState} {doc?.councilNumber}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={logout} className="gap-2">
          <LogOut className="h-4 w-4" /> Sair
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Próximas",  value: upcoming.length,  icon: Clock,        color: "text-blue-500" },
          { label: "Realizadas",value: completed.length, icon: CheckCircle2, color: "text-green-500" },
          { label: "Pacientes", value: 12, icon: Users, color: "text-purple-500" },
          { label: "Avaliação", value: "4.9⭐", icon: Award, color: "text-yellow-500" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`h-8 w-8 ${s.color}`} />
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Próxima consulta */}
      {next && (
        <Card className="mb-8 border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-primary flex items-center gap-2">
              <Clock className="h-4 w-4" /> Próxima consulta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-semibold">{next.doctorName}</p>
                <p className="text-sm text-muted-foreground">{next.specialty}</p>
                <p className="text-sm font-medium">
                  {format(new Date(next.date + "T12:00:00"), "dd 'de' MMMM", { locale: ptBR })} às {next.time}
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-0">Agendada</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Agenda */}
        <div className="md:col-span-2">
          <Tabs defaultValue="upcoming">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">Próximas ({upcoming.length})</TabsTrigger>
              <TabsTrigger value="history">Realizadas ({completed.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              <div className="space-y-3">
                {upcoming.map(a => (
                  <Card key={a.id}>
                    <CardContent className="p-4 flex items-center gap-3 flex-wrap">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Clock className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">Paciente — {a.doctorName.split(" ")[1]}</p>
                        <p className="text-xs text-muted-foreground">{a.specialty}</p>
                        <p className="text-xs font-medium">
                          {format(new Date(a.date + "T12:00:00"), "dd/MM/yyyy", { locale: ptBR })} às {a.time}
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 border-0 shrink-0">Agendada</Badge>
                    </CardContent>
                  </Card>
                ))}
                {upcoming.length === 0 && (
                  <p className="text-center py-8 text-muted-foreground">Nenhuma consulta agendada.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="space-y-3">
                {completed.map(a => (
                  <Card key={a.id}>
                    <CardContent className="p-4 flex items-center gap-3 flex-wrap">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">Consulta realizada</p>
                        <p className="text-xs text-muted-foreground">{a.specialty}</p>
                        <p className="text-xs font-medium">
                          {format(new Date(a.date + "T12:00:00"), "dd/MM/yyyy", { locale: ptBR })} às {a.time}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-0 shrink-0">Concluída</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Perfil profissional */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Meu Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">{doc?.name}</p>
                <p className="text-xs text-primary">{doc?.profession}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-xs">
                  {doc?.council}/{doc?.councilState} {doc?.councilNumber}
                </span>
              </div>
              {doc?.specialty && (
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{doc.specialty}</span>
                </div>
              )}
              {doc?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{doc.phone}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="bg-muted/50 rounded-md p-3 text-xs text-muted-foreground">
              Integração com agenda e prontuários disponível após integração com o backend.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
