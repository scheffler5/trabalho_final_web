"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllUsers, type DoctorUser } from "@/lib/auth";
import {
  Brain, Star, CalendarDays, CheckCircle2, Stethoscope, Users,
} from "lucide-react";

export default function MedicosPage() {
  const [doctors, setDoctors] = useState<DoctorUser[]>([]);

  useEffect(() => {
    const all = getAllUsers();
    const approved = all.filter(
      (u): u is DoctorUser => u.role === "doctor" && u.status === "approved"
    );
    setDoctors(approved);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-3">Nossa Equipe</Badge>
        <h1 className="text-4xl font-bold mb-4">Nossos Especialistas</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Profissionais cadastrados e aprovados pela clínica MenteSã.
        </p>
      </div>

      {/* Lista de médicos */}
      {doctors.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Stethoscope className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">Nenhum médico cadastrado ainda.</p>
          <p className="text-sm mt-1">
            Os profissionais aprovados pelo administrador aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {doctors.map((doc) => (
            <Card key={doc.id} className="overflow-hidden">
              <CardHeader className="pb-0">
                <div className="flex gap-4 items-start">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Brain className="h-9 w-9 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-lg leading-tight">{doc.name}</h2>
                    <p className="text-primary font-medium text-sm">
                      {doc.specialty || doc.profession}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {doc.council}/{doc.councilState} {doc.councilNumber}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">
                        Profissional verificado
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Informações
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" className="text-xs gap-1">
                      <Stethoscope className="h-3 w-3" />
                      {doc.profession}
                    </Badge>
                    {doc.specialty && (
                      <Badge variant="secondary" className="text-xs">
                        {doc.specialty}
                      </Badge>
                    )}
                  </div>
                </div>

                <Link href="/login">
                  <Button className="w-full gap-2 mt-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Agendar com este profissional
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 text-center p-8 bg-primary/5 rounded-2xl border">
        <Users className="h-8 w-8 text-primary mx-auto mb-3" />
        <h3 className="text-xl font-bold mb-2">É um profissional de saúde?</h3>
        <p className="text-muted-foreground mb-4">
          Faça seu cadastro e, após aprovação, seu perfil aparecerá aqui.
        </p>
        <Link href="/cadastro/profissional">
          <Button variant="outline">Cadastrar como profissional</Button>
        </Link>
      </div>
    </div>
  );
}
