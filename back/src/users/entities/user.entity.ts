import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany,
} from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';

export type UserRole   = 'patient' | 'doctor' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'rejected';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'text', default: 'patient' })
  role: UserRole;

  @Column({ type: 'text', default: 'pending' })
  status: UserStatus;

  @Column({ nullable: true })
  phone: string;

  // Patient fields
  @Column({ nullable: true })
  cpf: string;

  @Column({ nullable: true })
  dateOfBirth: string;

  // Doctor fields
  @Column({ nullable: true })
  profession: string;

  @Column({ nullable: true })
  council: string;

  @Column({ nullable: true })
  councilState: string;

  @Column({ nullable: true })
  councilNumber: string;

  @Column({ nullable: true })
  specialty: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Appointment, (a) => a.patient)
  appointmentsAsPatient: Appointment[];

  @OneToMany(() => Appointment, (a) => a.doctor)
  appointmentsAsDoctor: Appointment[];
}
