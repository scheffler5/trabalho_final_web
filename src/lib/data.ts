export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  crm: string;
  bio: string;
  photo: string;
  availableDays: string[];
  rating: number;
  reviewCount: number;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

export const DOCTORS: Doctor[] = [
  {
    id: "d1",
    name: "Dra. Ana Carolina Mendes",
    specialty: "Psiquiatria Adulto",
    crm: "CRM/SP 123456",
    bio: "Especialista em transtornos de ansiedade e depressão, com mais de 10 anos de experiência clínica. Formada pela USP com residência no Instituto de Psiquiatria.",
    photo: "",
    availableDays: ["Segunda", "Quarta", "Sexta"],
    rating: 4.9,
    reviewCount: 124,
  },
  {
    id: "d2",
    name: "Dr. Roberto Faria",
    specialty: "Psiquiatria Infantojuvenil",
    crm: "CRM/SP 234567",
    bio: "Referência em saúde mental infantil e transtornos do neurodesenvolvimento como TDAH e TEA. Membro da Associação Brasileira de Psiquiatria.",
    photo: "",
    availableDays: ["Terça", "Quinta"],
    rating: 4.8,
    reviewCount: 98,
  },
  {
    id: "d3",
    name: "Dra. Fernanda Oliveira",
    specialty: "Psiquiatria Geriátrica",
    crm: "CRM/SP 345678",
    bio: "Dedicada ao cuidado da saúde mental em idosos, com enfoque em demências, depressão geriátrica e qualidade de vida na terceira idade.",
    photo: "",
    availableDays: ["Segunda", "Terça", "Quinta"],
    rating: 4.7,
    reviewCount: 87,
  },
  {
    id: "d4",
    name: "Dr. Lucas Martins",
    specialty: "Psiquiatria Forense",
    crm: "CRM/SP 456789",
    bio: "Especialista em avaliações psiquiátricas forenses e reabilitação psicossocial. Professor universitário e pesquisador na área de saúde mental.",
    photo: "",
    availableDays: ["Quarta", "Sexta"],
    rating: 4.6,
    reviewCount: 65,
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "a1",
    doctorId: "d1",
    doctorName: "Dra. Ana Carolina Mendes",
    specialty: "Psiquiatria Adulto",
    date: "2026-10-15",
    time: "09:00",
    status: "scheduled",
    notes: "Primeira consulta - avaliação inicial",
  },
  {
    id: "a2",
    doctorId: "d2",
    doctorName: "Dr. Roberto Faria",
    specialty: "Psiquiatria Infantojuvenil",
    date: "2026-10-08",
    time: "14:30",
    status: "completed",
  },
  {
    id: "a3",
    doctorId: "d3",
    doctorName: "Dra. Fernanda Oliveira",
    specialty: "Psiquiatria Geriátrica",
    date: "2026-09-20",
    time: "11:00",
    status: "completed",
  },
];

export const TIME_SLOTS = [
  "08:00", "09:00", "09:30", "10:00", "10:30",
  "11:00", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00",
];
