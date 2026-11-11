"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAllUsers, type DoctorUser } from "@/lib/auth";
import { Brain, Star, ArrowRight, Stethoscope } from "lucide-react";

export default function FeaturedDoctors() {
  const [doctors, setDoctors] = useState<DoctorUser[]>([]);

  useEffect(() => {
    const all = getAllUsers();
    const approved = all
      .filter((u): u is DoctorUser => u.role === "doctor" && u.status === "approved")
      .slice(0, 2);
    setDoctors(approved);
  }, []);

  if (doctors.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Stethoscope className="h-10 w-10 mx-auto mb-3 opacity-20" />
        <p className="text-sm">Nenhum profissional aprovado ainda.</p>
        <Link href="/cadastro/profissional" className="mt-3 inline-block">
          <Button variant="outline" size="sm" className="gap-2">
            Cadastrar profissional <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {doctors.map((doc) => (
        <Card key={doc.id} className="flex gap-4 p-4 items-start">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Brain className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{doc.name}</h3>
            <p className="text-sm text-primary mb-1">
              {doc.specialty || doc.profession}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              {doc.council}/{doc.councilState} {doc.councilNumber}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-muted-foreground">
                Profissional verificado
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
