import { api } from "./api";

export interface Appointment {
  id: string;
  patientId: string;
  patient?: { id: string; name: string };
  doctorId: string;
  doctor?: { id: string; name: string; specialty?: string; profession?: string };
  specialty: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

export interface CreateAppointmentPayload {
  doctorId: string;
  specialty: string;
  date: string;
  time: string;
  notes?: string;
}

export const getPatientAppointments = () =>
  api<Appointment[]>("/appointments/me");

export const getDoctorAppointments = () =>
  api<Appointment[]>("/appointments/doctor");

export const getAllAppointments = () =>
  api<Appointment[]>("/appointments");

export const addAppointment = (payload: CreateAppointmentPayload) =>
  api<Appointment>("/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAppointmentStatus = (
  id: string,
  status: Appointment["status"],
) =>
  api<Appointment>(`/appointments/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export function isUpcoming(a: Appointment) {
  return a.status === "scheduled" && a.date >= new Date().toISOString().slice(0, 10);
}
