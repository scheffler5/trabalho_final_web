// Tipos compartilhados e helpers de roteamento.
// CRUD de usuários e sessão foram movidos para AuthContext + lib/api.ts

export type UserRole   = "patient" | "doctor" | "admin";
export type UserStatus = "pending" | "approved" | "rejected";

export interface PatientUser {
  id: string; name: string; email: string;
  role: "patient"; status: UserStatus; createdAt: string;
  cpf?: string; dateOfBirth?: string; phone?: string;
}

export interface DoctorUser {
  id: string; name: string; email: string;
  role: "doctor"; status: UserStatus; createdAt: string;
  profession: string; council: string; councilState: string; councilNumber: string;
  specialty?: string; phone?: string;
}

export interface AdminUser {
  id: string; name: string; email: string;
  role: "admin"; status: UserStatus; createdAt: string;
}

export type User = PatientUser | DoctorUser | AdminUser;

export const ADMIN_REGISTER_CODE = "MENTESA2025";

export const PROFESSION_COUNCIL: Record<string, string> = {
  "Médico":     "CRM",
  "Psiquiatra": "CRM",
  "Psicólogo":  "CRP",
  "Terapeuta":  "CRP",
};

export const UF_LIST = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
];

export function getRoleHome(role: UserRole): string {
  if (role === "admin")  return "/admin";
  if (role === "doctor") return "/medico";
  return "/dashboard";
}
