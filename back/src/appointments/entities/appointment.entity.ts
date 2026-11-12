import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (u) => u.appointmentsAsPatient, { eager: false })
  @JoinColumn({ name: 'patientId' })
  patient: User;

  @Column()
  patientId: string;

  @ManyToOne(() => User, (u) => u.appointmentsAsDoctor, { eager: false })
  @JoinColumn({ name: 'doctorId' })
  doctor: User;

  @Column()
  doctorId: string;

  @Column()
  specialty: string;

  @Column()
  date: string; // YYYY-MM-DD

  @Column()
  time: string; // HH:MM

  @Column({ type: 'text', default: 'scheduled' })
  status: AppointmentStatus;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}
