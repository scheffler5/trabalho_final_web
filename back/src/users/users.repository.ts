import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
  ) {}

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findByEmailWithPassword(email: string) {
    return this.repo
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.email = :email', { email })
      .getOne();
  }

  findApprovedDoctors() {
    return this.repo.find({
      where: { role: 'doctor', status: 'approved' },
      order: { name: 'ASC' },
    });
  }

  findPending() {
    return this.repo.find({ where: { status: 'pending' } });
  }

  create(data: Partial<User>) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async updateStatus(id: string, status: UserStatus) {
    await this.repo.update(id, { status });
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (user) await this.repo.remove(user);
    return { deleted: true };
  }
}
