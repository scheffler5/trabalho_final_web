import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { SeedModule } from './seed/seed.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { User } from './users/entities/user.entity';
import { Appointment } from './appointments/entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_PATH || 'database.sqlite',
      entities: [User, Appointment],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    AppointmentsModule,
    SeedModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
