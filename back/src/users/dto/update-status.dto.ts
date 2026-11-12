import { IsIn } from 'class-validator';
import { UserStatus } from '../entities/user.entity';

export class UpdateStatusDto {
  @IsIn(['approved', 'rejected'], { message: 'Status inválido' })
  status: UserStatus;
}
