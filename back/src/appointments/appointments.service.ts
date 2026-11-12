import {
  Injectable, NotFoundException, ForbiddenException,
  BadRequestException, ConflictException,
} from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';
import { UsersRepository } from '../users/users.repository';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { User } from '../users/entities/user.entity';
import { ListAppointmentsQueryDto } from './dto/query-appointment.dto';

// Grade de atendimento da clínica (regra de negócio, por isso fica no service)
export const TIME_SLOTS = [
  '08:00', '09:00', '09:30', '10:00', '10:30',
  '11:00', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00',
];

@Injectable()
export class AppointmentsService {
  constructor(
    private repo: AppointmentsRepository,
    private usersRepo: UsersRepository,
  ) {}

  findAll(q: ListAppointmentsQueryDto)                 { return this.repo.findAll(q); }
  findByPatient(id: string, q: ListAppointmentsQueryDto) { return this.repo.findByPatient(id, q); }
  findByDoctor(id: string, q: ListAppointmentsQueryDto)  { return this.repo.findByDoctor(id, q); }

  // Horários do dia, marcando quais ainda estão livres para o médico
  async getSlots(doctorId: string, date: string) {
    await this.getApprovedDoctor(doctorId);
    const booked = await this.repo.findBookedTimes(doctorId, date);
    return TIME_SLOTS.map((time) => ({ time, available: !booked.includes(time) }));
  }

  private async getApprovedDoctor(id: string) {
    const doctor = await this.usersRepo.findById(id);
    if (!doctor || doctor.role !== 'doctor' || doctor.status !== 'approved')
      throw new NotFoundException('Médico não encontrado ou não disponível');
    return doctor;
  }

  async create(dto: CreateAppointmentDto, patient: User) {
    const doctor = await this.getApprovedDoctor(dto.doctorId);
    if (!TIME_SLOTS.includes(dto.time))
      throw new BadRequestException('Horário fora da grade de atendimento');
    const booked = await this.repo.findBookedTimes(doctor.id, dto.date);
    if (booked.includes(dto.time))
      throw new ConflictException('Este horário já está ocupado');

    return this.repo.create({
      patientId: patient.id,
      doctorId:  doctor.id,
      specialty: dto.specialty,
      date:      dto.date,
      time:      dto.time,
      notes:     dto.notes,
      status:    'scheduled',
    });
  }

  async updateStatus(id: string, dto: UpdateAppointmentDto, user: User) {
    const appt = await this.repo.findById(id);
    if (!appt) throw new NotFoundException('Consulta não encontrada');

    // Apenas o paciente dono, o médico da consulta ou admin podem alterar
    const allowed = user.role === 'admin'
      || appt.patientId === user.id
      || appt.doctorId  === user.id;
    if (!allowed) throw new ForbiddenException('Sem permissão para alterar esta consulta');

    return this.repo.updateStatus(id, dto.status);
  }

  async remove(id: string, user: User) {
    const appt = await this.repo.findById(id);
    if (!appt) throw new NotFoundException('Consulta não encontrada');
    if (user.role !== 'admin' && appt.patientId !== user.id)
      throw new ForbiddenException('Sem permissão');
    return this.repo.remove(id);
  }
}
