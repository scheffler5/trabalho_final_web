import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
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
  findAll() {
    return this.svc.findAll();
  }

  // Paciente — suas consultas
  @Get('me')
  @UseGuards(RolesGuard)
  @Roles('patient')
  myAppointments(@CurrentUser() user: any) {
    return this.svc.findByPatient(user.id);
  }

  // Médico — suas consultas
  @Get('doctor')
  @UseGuards(RolesGuard)
  @Roles('doctor')
  doctorAppointments(@CurrentUser() user: any) {
    return this.svc.findByDoctor(user.id);
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
