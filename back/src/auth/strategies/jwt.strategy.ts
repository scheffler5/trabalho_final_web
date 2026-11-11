import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from '../../users/users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersRepo: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'mentesa-secret-2025',
    });
  }

  async validate(payload: { sub: string; role: string }) {
    const user = await this.usersRepo.findById(payload.sub);
    if (!user || user.status !== 'approved') throw new UnauthorizedException();
    return user;
  }
}
