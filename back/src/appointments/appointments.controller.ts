import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ListAppointmentsQueryDto, SlotsQueryDto } from './dto/query-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private svc: AppointmentsService) {}

  // Admin — todas as consultas
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAll(@Query() q: ListAppointmentsQueryDto) {
    return this.svc.findAll(q);
  }

  // Paciente — suas consultas
  @Get('me')
  @UseGuards(RolesGuard)
  @Roles('patient')
  myAppointments(@CurrentUser() user: any, @Query() q: ListAppointmentsQueryDto) {
    return this.svc.findByPatient(user.id, q);
  }

  // Médico — suas consultas
  @Get('doctor')
  @UseGuards(RolesGuard)
  @Roles('doctor')
  doctorAppointments(@CurrentUser() user: any, @Query() q: ListAppointmentsQueryDto) {
    return this.svc.findByDoctor(user.id, q);
  }

  // Autenticado — horários livres de um médico num dia
  // GET /appointments/slots?doctorId=<uuid>&date=YYYY-MM-DD
  @Get('slots')
  slots(@Query() q: SlotsQueryDto) {
    return this.svc.getSlots(q.doctorId, q.date);
  }

  // Paciente — criar consulta
  @Post()
  @UseGuards(RolesGuard)
  @Roles('patient')
  create(@Body() dto: CreateAppointmentDto, @CurrentUser() user: any) {
    return this.svc.create(dto, user);
  }

  // Atualizar status (paciente, médico ou admin)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentDto,
    @CurrentUser() user: any,
  ) {
    return this.svc.updateStatus(id, dto, user);
  }

  // Cancelar / remover consulta
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.svc.remove(id, user);
  }
}
