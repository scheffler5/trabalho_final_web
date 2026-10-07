"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import {
  getPatientAppointments, isUpcoming, type Appointment,
} from "@/lib/appointments";
import {
  CalendarDays, Brain, Plus, Clock, CheckCircle2, XCircle, LogOut, User,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function statusBadge(status: string) {
  if (status === "scheduled")
    return <Badge className="bg-blue-100 text-blue-700 border-0">Agendada</Badge>;
  if (status === "completed")
    return <Badge className="bg-green-100 text-green-700 border-0">Concluída</Badge>;
  return <Badge className="bg-red-100 text-red-700 border-0">Cancelada</Badge>;
}

function statusIcon(status: string) {
  if (status === "scheduled") return <Clock className="h-4 w-4 text-blue-500" />;
  if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  return <XCircle className="h-4 w-4 text-red-500" />;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (user) setAppointments(getPatientAppointments(user.id));
  }, [user]);

  const upcoming = appointments.filter(isUpcoming);
  const past     = appointments.filter((a) => !isUpcoming(a));
  const nextAppt = upcoming[0];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Olá, {user?.name?.split(" ")[0]}!</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={logout} className="gap-2">
          <LogOut className="h-4 w-4" /> Sair
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Próximas",   value: upcoming.length,                                      icon: CalendarDays,  color: "text-blue-500"   },
          { label: "Realizadas", value: past.filter(a => a.status === "completed").length,    icon: CheckCircle2,  color: "text-green-500"  },
          { label: "Total",      value: appointments.length,                                  icon: Brain,         color: "text-primary"    },
          { label: "Médicos",    value: new Set(appointments.map(a => a.doctorId)).size,      icon: User,          color: "text-orange-500" },
        ].map((s) => (
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

      {/* Próxima consulta em destaque */}
      {nextAppt && (
        <Card className="mb-8 border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-primary flex items-center gap-2">
              <Clock className="h-4 w-4" /> Próxima consulta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{nextAppt.doctorName}</p>
                  <p className="text-sm text-muted-foreground">{nextAppt.specialty}</p>
                  <p className="text-sm font-medium">
                    {format(new Date(nextAppt.date + "T12:00:00"), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}{" "}
                    às {nextAppt.time}
                  </p>
                </div>
              </div>
              {statusBadge(nextAppt.status)}
            </div>
            {nextAppt.notes && (
              <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                Obs: {nextAppt.notes}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Ações */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link href="/dashboard/agendar">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Agendar Consulta
          </Button>
        </Link>
        <Link href="/medicos">
          <Button variant="outline" className="gap-2">
            <Brain className="h-4 w-4" /> Ver Médicos
          </Button>
        </Link>
      </div>

      {/* Lista de consultas */}
      <Tabs defaultValue="upcoming">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Próximas ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="history">Histórico ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcoming.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Nenhuma consulta agendada.</p>
              <Link href="/dashboard/agendar">
                <Button className="mt-4 gap-2">
                  <Plus className="h-4 w-4" /> Agendar agora
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((a) => <AppointmentCard key={a.id} appt={a} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          {past.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Nenhuma consulta no histórico.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {past.map((a) => <AppointmentCard key={a.id} appt={a} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AppointmentCard({ appt }: { appt: Appointment }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
            {statusIcon(appt.status)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{appt.doctorName}</p>
            <p className="text-xs text-muted-foreground">{appt.specialty}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(appt.date + "T12:00:00"), "dd/MM/yyyy", { locale: ptBR })} às {appt.time}
            </p>
          </div>
          <div className="shrink-0">{statusBadge(appt.status)}</div>
        </div>
        {appt.notes && (
          <p className="text-xs text-muted-foreground mt-2 border-t pt-2">{appt.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}
