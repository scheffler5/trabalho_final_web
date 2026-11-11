import { IsIn, IsOptional, IsUUID, Matches } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

// Query params de listagem: GET /appointments/me?status=scheduled
export class ListAppointmentsQueryDto {
  @IsOptional()
  @IsIn(['scheduled', 'completed', 'cancelled'], { message: 'Status inválido' })
  status?: AppointmentStatus;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data deve ser YYYY-MM-DD' })
  date?: string;
}

// Query params de horários: GET /appointments/slots?doctorId=...&date=YYYY-MM-DD
export class SlotsQueryDto {
  @IsUUID('all', { message: 'doctorId inválido' })
  doctorId: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data deve ser YYYY-MM-DD' })
  date: string;
}
