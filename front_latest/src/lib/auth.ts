// ─── User types ──────────────────────────────────────────────────────────────

export type UserRole   = "patient" | "doctor" | "admin";
export type UserStatus = "pending" | "approved" | "rejected";

export interface PatientUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "patient";
  status: UserStatus;
  createdAt: string;
  cpf?: string;
  dateOfBirth?: string;
  phone?: string;
}

export interface DoctorUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "doctor";
  status: UserStatus;
  createdAt: string;
  profession: string;
  council: string;      // CRM ou CRP
  councilState: string; // SP, RJ, MG...
  councilNumber: string;
  specialty?: string;
  phone?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin";
  status: UserStatus;
  createdAt: string;
}

export type User = PatientUser | DoctorUser | AdminUser;

// ─── Constants ───────────────────────────────────────────────────────────────

export const AUTH_COOKIE_NAME   = "clinica_auth";
export const USERS_STORAGE_KEY  = "clinica_users";
export const ADMIN_REGISTER_CODE = "MENTESA2025";

export const UF_LIST = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
];

export const PROFESSION_COUNCIL: Record<string, string> = {
  "Médico":      "CRM",
  "Psiquiatra":  "CRM",
  "Psicólogo":   "CRP",
  "Terapeuta":   "CRP",
};

// ─── Initial seed users ───────────────────────────────────────────────────────

const SEED_USERS: User[] = [
  {
    id: "u1", name: "Maria Silva",
    email: "paciente@clinica.com", password: "paciente123",
    role: "patient", status: "approved",
    createdAt: "2026-01-15T00:00:00.000Z",
    cpf: "123.456.789-00", dateOfBirth: "1990-03-15", phone: "(11) 99999-0001",
  },
  {
    id: "u2", name: "Dra. Ana Carolina Mendes",
    email: "medico@clinica.com", password: "medico123",
    role: "doctor", status: "approved",
    createdAt: "2026-01-10T00:00:00.000Z",
    profession: "Médico", council: "CRM",
    councilState: "SP", councilNumber: "123456",
    specialty: "Psiquiatria Adulto", phone: "(11) 98888-0002",
  },
  {
    id: "u3", name: "Roberto Faria",
    email: "medico2@clinica.com", password: "medico123",
    role: "doctor", status: "pending",
    createdAt: "2026-10-01T00:00:00.000Z",
    profession: "Médico", council: "CRM",
    councilState: "SP", councilNumber: "234567",
    specialty: "Psiquiatria Infantojuvenil",
  },
  {
    id: "u4", name: "Dr. Administrador",
    email: "admin@clinica.com", password: "admin123",
    role: "admin", status: "approved",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

// ─── Storage helpers ──────────────────────────────────────────────────────────

function initUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as User[];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(SEED_USERS));
    return SEED_USERS;
  } catch {
    return SEED_USERS;
  }
}

export function getAllUsers(): User[] {
  if (typeof window === "undefined") return SEED_USERS;
  return initUsers();
}

export function saveUsers(users: User[]): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users)); } catch {}
}

export function registerUser(user: User): { ok: boolean; message: string } {
  const users = getAllUsers();
  if (users.find((u) => u.email === user.email)) {
    return { ok: false, message: "Este e-mail já está cadastrado." };
  }
  users.push(user);
  saveUsers(users);
  return { ok: true, message: "Cadastro realizado com sucesso!" };
}

export function updateUserStatus(id: string, status: UserStatus): void {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx !== -1) { users[idx].status = status; saveUsers(users); }
}

export function findApprovedUser(email: string, password: string): User | null {
  const users = getAllUsers();
  return users.find(
    (u) => u.email === email && u.password === password && u.status === "approved"
  ) ?? null;
}

export function findUserByEmail(email: string): User | null {
  const users = getAllUsers();
  return users.find((u) => u.email === email) ?? null;
}

// ─── Session helpers ──────────────────────────────────────────────────────────

export function getUserFromStorage(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_COOKIE_NAME);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch { return null; }
}

export function setUserInStorage(user: User): void {
  localStorage.setItem(AUTH_COOKIE_NAME, JSON.stringify(user));
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify({ id: user.id, role: user.role })
  )}; path=/; Max-Age=${60 * 60 * 24 * 7}`; // 7 dias
}

export function clearUserFromStorage(): void {
  localStorage.removeItem(AUTH_COOKIE_NAME);
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function getRoleHome(role: UserRole): string {
  if (role === "admin")  return "/admin";
  if (role === "doctor") return "/medico";
  return "/dashboard";
}
