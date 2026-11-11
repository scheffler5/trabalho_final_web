import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';

@Injectable()
export class AppointmentsRepository {
  constructor(
    @InjectRepository(Appointment) private repo: Repository<Appointment>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['patient', 'doctor'],
      order: { date: 'DESC', time: 'DESC' },
    });
  }

  findByPatient(patientId: string) {
    return this.repo.find({
      where: { patientId },
      relations: ['doctor'],
      order: { date: 'ASC', time: 'ASC' },
    });
  }

  findByDoctor(doctorId: string) {
    return this.repo.find({
      where: { doctorId },
      relations: ['patient'],
      order: { date: 'ASC', time: 'ASC' },
    });
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
