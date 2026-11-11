import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class SeedService implements OnModuleInit {
  private logger = new Logger('Seed');

  constructor(private usersRepo: UsersRepository) {}

  async onModuleInit() {
    const count = await this.usersRepo.findAll().then((u) => u.length);
    if (count > 0) return;

    this.logger.log('Inserindo dados iniciais...');

    const seeds = [
      {
        name: 'Maria Silva',
        email: 'paciente@clinica.com',
        password: await bcrypt.hash('paciente123', 10),
        role: 'patient' as const,
        status: 'approved' as const,
        cpf: '123.456.789-00',
        dateOfBirth: '1990-03-15',
        phone: '(11) 99999-0001',
      },
      {
        name: 'Dra. Ana Carolina Mendes',
        email: 'medico@clinica.com',
        password: await bcrypt.hash('medico123', 10),
        role: 'doctor' as const,
        status: 'approved' as const,
        profession: 'Médico',
        council: 'CRM',
        councilState: 'SP',
        councilNumber: '123456',
        specialty: 'Psiquiatria Adulto',
        phone: '(11) 98888-0002',
      },
      {
        name: 'Dr. Roberto Faria',
        email: 'medico2@clinica.com',
        password: await bcrypt.hash('medico123', 10),
        role: 'doctor' as const,
        status: 'pending' as const,
        profession: 'Psiquiatra',
        council: 'CRM',
        councilState: 'SP',
        councilNumber: '234567',
        specialty: 'Psiquiatria Infantojuvenil',
      },
      {
        name: 'Administrador',
        email: 'admin@clinica.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin' as const,
        status: 'approved' as const,
      },
    ];

    for (const seed of seeds) {
      await this.usersRepo.create(seed);
    }

    this.logger.log('Seed concluído — 4 usuários criados');
  }
}
