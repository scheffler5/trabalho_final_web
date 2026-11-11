import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserStatus } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private repo: UsersRepository) {}

  findAll()            { return this.repo.findAll(); }
  findApprovedDoctors(){ return this.repo.findApprovedDoctors(); }
  findPending()        { return this.repo.findPending(); }

  async findOne(id: string) {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async updateStatus(id: string, status: UserStatus) {
    await this.findOne(id);
    return this.repo.updateStatus(id, status);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repo.remove(id);
  }
}
