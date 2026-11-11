export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;   // "YYYY-MM-DD"
  time: string;   // "HH:MM"
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

const KEY = "clinica_appointments";

export function getAllAppointments(): Appointment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Appointment[]) : [];
  } catch { return []; }
}

function save(appointments: Appointment[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(appointments)); } catch {}
}

export function addAppointment(appt: Appointment): void {
  const all = getAllAppointments();
  all.push(appt);
  save(all);
}

export function getPatientAppointments(patientId: string): Appointment[] {
  return getAllAppointments().filter((a) => a.patientId === patientId);
}

export function getDoctorAppointments(doctorId: string): Appointment[] {
  return getAllAppointments().filter((a) => a.doctorId === doctorId);
}

export function isUpcoming(appt: Appointment): boolean {
  return appt.status === "scheduled" && appt.date >= new Date().toISOString().slice(0, 10);
}
