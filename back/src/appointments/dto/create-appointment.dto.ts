import { IsString, IsUUID, Matches, IsOptional, MaxLength } from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  doctorId: string;

  @IsString()
  specialty: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data deve ser YYYY-MM-DD' })
  date: string;

  @Matches(/^\d{2}:\d{2}$/, { message: 'Horário deve ser HH:MM' })
  time: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  notes?: string;
}
