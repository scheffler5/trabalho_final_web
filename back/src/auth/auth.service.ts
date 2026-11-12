import {
  Injectable, UnauthorizedException, ConflictException,
  ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../users/users.repository';
import { LoginDto } from './dto/login.dto';
import {
  RegisterPatientDto, RegisterDoctorDto, RegisterAdminDto,
} from './dto/register.dto';
import { User } from '../users/entities/user.entity';

const ADMIN_CODE = process.env.ADMIN_CODE || 'MENTESA2025';

@Injectable()
export class AuthService {
  constructor(
    private usersRepo: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findByEmailWithPassword(dto.email);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciais inválidas');

    if (user.status === 'pending')
      throw new ForbiddenException('Cadastro aguardando aprovação do administrador');
    if (user.status === 'rejected')
      throw new ForbiddenException('Cadastro reprovado');

    const token = this.sign(user);
    const { password: _, ...safeUser } = user as any;
    return { access_token: token, user: safeUser };
  }

  async registerPatient(dto: RegisterPatientDto) {
    await this.ensureEmailFree(dto.email);
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersRepo.create({
      ...dto,
      password: hashed,
      role: 'patient',
      status: 'approved',
    });
    const { password: _, ...safe } = user as any;
    return safe;
  }

  async registerDoctor(dto: RegisterDoctorDto) {
    await this.ensureEmailFree(dto.email);
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersRepo.create({
      ...dto,
      password: hashed,
      role: 'doctor',
      status: 'pending',
    });
    const { password: _, ...safe } = user as any;
    return safe;
  }

  async registerAdmin(dto: RegisterAdminDto) {
    if (dto.registerCode !== ADMIN_CODE)
      throw new BadRequestException('Código de administrador inválido');
    await this.ensureEmailFree(dto.email);
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
      role: 'admin',
      status: 'approved',
    });
    const { password: _, ...safe } = user as any;
    return safe;
  }

  private sign(user: User) {
    return this.jwtService.sign({ sub: user.id, role: user.role });
  }

  private async ensureEmailFree(email: string) {
    const existing = await this.usersRepo.findByEmail(email);
    if (existing) throw new ConflictException('E-mail já cadastrado');
  }
}
