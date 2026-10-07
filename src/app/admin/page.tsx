"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import {
  type User, type DoctorUser,
  getAllUsers, updateUserStatus,
} from "@/lib/auth";
import {
  Users, UserCheck, Clock, XCircle, CheckCircle2,
  Stethoscope, User as UserIcon, ShieldCheck, LogOut,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function roleBadge(role: string) {
  if (role === "admin")   return <Badge className="bg-orange-100 text-orange-700 border-0">Admin</Badge>;
  if (role === "doctor")  return <Badge className="bg-purple-100 text-purple-700 border-0">Médico</Badge>;
  return                         <Badge className="bg-blue-100 text-blue-700 border-0">Paciente</Badge>;
}

function statusBadge(status: string) {
  if (status === "approved") return <Badge className="bg-green-100 text-green-700 border-0">Aprovado</Badge>;
  if (status === "pending")  return <Badge className="bg-yellow-100 text-yellow-700 border-0">Pendente</Badge>;
  return                            <Badge className="bg-red-100 text-red-700 border-0">Reprovado</Badge>;
}

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  function reload() { setUsers(getAllUsers()); }

  useEffect(() => { reload(); }, []);

  function approve(id: string) { updateUserStatus(id, "approved"); reload(); }
  function reject(id: string)  { updateUserStatus(id, "rejected"); reload(); }

  const pending   = users.filter(u => u.status === "pending");
  const doctors   = users.filter(u => u.role === "doctor");
  const patients  = users.filter(u => u.role === "patient");
  const admins    = users.filter(u => u.role === "admin");

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            <p className="text-sm text-muted-foreground">{user?.name} · {user?.email}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={logout} className="gap-2">
          <LogOut className="h-4 w-4" /> Sair
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Pacientes",  value: patients.length,  icon: UserIcon,    color: "text-blue-500" },
          { label: "Médicos",    value: doctors.length,   icon: Stethoscope, color: "text-purple-500" },
          { label: "Pendentes",  value: pending.length,   icon: Clock,       color: "text-yellow-500" },
          { label: "Admins",     value: admins.length,    icon: ShieldCheck, color: "text-orange-500" },
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

      <Tabs defaultValue="queue">
        <TabsList className="mb-6">
          <TabsTrigger value="queue" className="gap-2">
            <Clock className="h-4 w-4" />
            Fila de Aprovação
            {pending.length > 0 && (
              <span className="ml-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Todos os Usuários ({users.length})
          </TabsTrigger>
        </TabsList>

        {/* FILA DE APROVAÇÃO */}
        <TabsContent value="queue">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                Cadastros aguardando aprovação
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pending.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <CheckCircle2 className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p>Nenhum cadastro pendente. Tudo em dia!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pending.map(u => (
                    <QueueCard key={u.id} user={u}
                      onApprove={() => approve(u.id)}
                      onReject={() => reject(u.id)} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TODOS OS USUÁRIOS */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Fila completa de cadastros ({users.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium text-muted-foreground">Nome</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">E-mail</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Perfil</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Cadastro</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b hover:bg-muted/20">
                        <td className="p-3 font-medium">{u.name}</td>
                        <td className="p-3 text-muted-foreground text-xs">{u.email}</td>
                        <td className="p-3">{roleBadge(u.role)}</td>
                        <td className="p-3">{statusBadge(u.status)}</td>
                        <td className="p-3 text-xs text-muted-foreground">
                          {format(new Date(u.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                        </td>
                        <td className="p-3">
                          {u.status === "pending" && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="h-7 text-xs text-green-600 border-green-300"
                                onClick={() => approve(u.id)}>
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Aprovar
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-300"
                                onClick={() => reject(u.id)}>
                                <XCircle className="h-3 w-3 mr-1" /> Reprovar
                              </Button>
                            </div>
                          )}
                          {u.status === "rejected" && (
                            <Button size="sm" variant="outline" className="h-7 text-xs text-green-600 border-green-300"
                              onClick={() => approve(u.id)}>
                              Reativar
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function QueueCard({ user, onApprove, onReject }: {
  user: User;
  onApprove: () => void;
  onReject: () => void;
}) {
  const doc = user as DoctorUser;
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
            <Stethoscope className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.role === "doctor" && (
              <p className="text-xs text-primary mt-1">
                {doc.council}/{doc.councilState} {doc.councilNumber}
                {doc.specialty ? ` · ${doc.specialty}` : ""}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Cadastrado em {format(new Date(user.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" onClick={onApprove} className="gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> Aprovar
          </Button>
          <Button size="sm" variant="outline" onClick={onReject}
            className="gap-1.5 text-destructive hover:bg-destructive/10">
            <XCircle className="h-4 w-4" /> Reprovar
          </Button>
        </div>
      </div>
    </div>
  );
}
