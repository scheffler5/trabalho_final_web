import {
  Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';
import { UsersRepository } from '../users/users.repository';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    private repo: AppointmentsRepository,
    private usersRepo: UsersRepository,
  ) {}

  findAll()                    { return this.repo.findAll(); }
  findByPatient(id: string)    { return this.repo.findByPatient(id); }
  findByDoctor(id: string)     { return this.repo.findByDoctor(id); }

  async create(dto: CreateAppointmentDto, patient: User) {
    const doctor = await this.usersRepo.findById(dto.doctorId);
    if (!doctor || doctor.role !== 'doctor' || doctor.status !== 'approved')
      throw new NotFoundException('Médico não encontrado ou não disponível');

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
