import { IsIn } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class UpdateAppointmentDto {
  @IsIn(['scheduled', 'completed', 'cancelled'], { message: 'Status inválido' })
  status: AppointmentStatus;
}
