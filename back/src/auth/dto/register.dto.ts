import {
  IsEmail, IsString, MinLength, IsOptional, Matches, IsIn,
} from 'class-validator';

export class RegisterPatientDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Senha deve ter mínimo 8 caracteres' })
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;
}

export class RegisterDoctorDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Senha deve ter mínimo 8 caracteres' })
  password: string;

  @IsString()
  @IsIn(['Médico', 'Psiquiatra', 'Psicólogo', 'Terapeuta'], {
    message: 'Profissão inválida',
  })
  profession: string;

  @IsString()
  council: string;

  @IsString()
  councilState: string;

  @IsString()
  @Matches(/^\d{4,8}$/, { message: 'Número do conselho inválido' })
  councilNumber: string;

  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class RegisterAdminDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  registerCode: string;
}
