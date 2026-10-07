"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { DOCTORS, TIME_SLOTS } from "@/lib/data";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle2, CalendarDays, Clock, Brain } from "lucide-react";

const scheduleSchema = z.object({
  doctorId: z.string().min(1, "Selecione um médico"),
  date: z.date().refine((d) => d instanceof Date, { message: "Selecione uma data" }),
  time: z.string().min(1, "Selecione um horário"),
  notes: z.string().max(300, "Máximo de 300 caracteres").optional(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

export default function AgendarPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<(typeof DOCTORS)[number] | null>(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
  });

  const watchedDate = watch("date");

  function onDoctorChange(id: string) {
    const doc = DOCTORS.find((d) => d.id === id) ?? null;
    setSelectedDoctor(doc);
    setValue("doctorId", id);
  }

  async function onSubmit(data: ScheduleFormData) {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Consulta Agendada!</h2>
        <p className="text-muted-foreground mb-6">
          Sua consulta foi agendada com sucesso. Você receberá uma confirmação em breve.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard">
            <Button>Ver meus agendamentos</Button>
          </Link>
          <Button variant="outline" onClick={() => setSuccess(false)}>
            Agendar outra consulta
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Back */}
      <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Voltar ao painel
      </Link>

      <h1 className="text-3xl font-bold mb-2">Agendar Consulta</h1>
      <p className="text-muted-foreground mb-8">
        Escolha o médico, data e horário disponível.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1 – Doctor */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" /> 1. Escolha o médico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Controller
              control={control}
              name="doctorId"
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label>Médico</Label>
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      if (val) onDoctorChange(val);
                    }}
                  >
                    <SelectTrigger aria-invalid={!!errors.doctorId}>
                      <SelectValue placeholder="Selecione um especialista" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCTORS.map((doc) => (
                        <SelectItem key={doc.id} value={doc.id}>
                          <span className="font-medium">{doc.name}</span>
                          <span className="text-muted-foreground ml-2 text-xs">
                            — {doc.specialty}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.doctorId && (
                    <p className="text-xs text-destructive">{errors.doctorId.message}</p>
                  )}
                </div>
              )}
            />

            {selectedDoctor && (
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs text-muted-foreground">Atende:</span>
                {selectedDoctor.availableDays.map((d) => (
                  <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2 – Date */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" /> 2. Escolha a data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    locale={ptBR}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-md border w-fit"
                  />
                  {errors.date && (
                    <p className="text-xs text-destructive">{errors.date.message}</p>
                  )}
                  {watchedDate && (
                    <p className="text-sm text-muted-foreground">
                      Selecionado:{" "}
                      <span className="text-foreground font-medium">
                        {format(watchedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                    </p>
                  )}
                </div>
              )}
            />
          </CardContent>
        </Card>

        {/* Step 3 – Time */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> 3. Escolha o horário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              control={control}
              name="time"
              render={({ field }) => (
                <div className="space-y-1.5">
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {TIME_SLOTS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => field.onChange(t)}
                        className={`px-2 py-2 text-sm rounded-md border transition-colors ${
                          field.value === t
                            ? "bg-primary text-primary-foreground border-primary"
                            : "hover:border-primary hover:text-primary"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {errors.time && (
                    <p className="text-xs text-destructive">{errors.time.message}</p>
                  )}
                </div>
              )}
            />
          </CardContent>
        </Card>

        {/* Step 4 – Notes */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">4. Observações (opcional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Descreva brevemente o motivo da consulta</Label>
              <textarea
                id="notes"
                {...register("notes")}
                placeholder="Ex: Primeira consulta, acompanhamento de ansiedade..."
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
              {errors.notes && (
                <p className="text-xs text-destructive">{errors.notes.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Confirmando..." : "Confirmar Agendamento"}
        </Button>
      </form>
    </div>
  );
}
