import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { ListAppointmentsQueryDto } from './dto/query-appointment.dto';

@Injectable()
export class AppointmentsRepository {
  constructor(
    @InjectRepository(Appointment) private repo: Repository<Appointment>,
  ) {}

  findAll(filters: ListAppointmentsQueryDto = {}) {
    return this.repo.find({
      where: this.filters(filters),
      relations: ['patient', 'doctor'],
      order: { date: 'DESC', time: 'DESC' },
    });
  }

  findByPatient(patientId: string, filters: ListAppointmentsQueryDto = {}) {
    return this.repo.find({
      where: { patientId, ...this.filters(filters) },
      relations: ['doctor'],
      order: { date: 'ASC', time: 'ASC' },
    });
  }

  findByDoctor(doctorId: string, filters: ListAppointmentsQueryDto = {}) {
    return this.repo.find({
      where: { doctorId, ...this.filters(filters) },
      relations: ['patient'],
      order: { date: 'ASC', time: 'ASC' },
    });
  }

  // Horários já ocupados de um médico num dia (consultas canceladas liberam o horário)
  findBookedTimes(doctorId: string, date: string) {
    return this.repo
      .find({ where: { doctorId, date, status: 'scheduled' }, select: { time: true } })
      .then((list) => list.map((a) => a.time));
  }

  // Monta o where só com os filtros que vieram na query
  private filters({ status, date }: ListAppointmentsQueryDto) {
    return {
      ...(status ? { status } : {}),
      ...(date ? { date } : {}),
    };
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['patient', 'doctor'] });
  }

  create(data: Partial<Appointment>) {
    const appt = this.repo.create(data);
    return this.repo.save(appt);
  }

  async updateStatus(id: string, status: string) {
    await this.repo.update(id, { status: status as any });
    return this.findById(id);
  }

  async remove(id: string) {
    const appt = await this.repo.findOne({ where: { id } });
    if (appt) await this.repo.remove(appt);
    return { deleted: true };
  }
}
