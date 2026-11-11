import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthMiddleware } from './middleware/auth.middleware';
import { RolesMiddleware } from './middleware/roles.middleware';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ProxyModule } from './proxy/proxy.module';

@Module({ imports: [ProxyModule] })
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Loga todas as requisições
    consumer.apply(LoggerMiddleware).forRoutes('*');

    // Valida JWT em todas as rotas exceto as públicas
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login',            method: RequestMethod.POST },
        { path: 'auth/register/patient', method: RequestMethod.POST },
        { path: 'auth/register/doctor',  method: RequestMethod.POST },
        { path: 'auth/register/admin',   method: RequestMethod.POST },
        { path: 'users/doctors',         method: RequestMethod.GET  },
      )
      .forRoutes('*');

    // Controle de papéis em rotas restritas
    consumer
      .apply(RolesMiddleware)
      .forRoutes(
        { path: 'users',          method: RequestMethod.GET    },
        { path: 'users/pending',  method: RequestMethod.GET    },
        { path: 'users/:id/status', method: RequestMethod.PATCH  },
        { path: 'users/:id',      method: RequestMethod.DELETE },
        { path: 'appointments',   method: RequestMethod.GET    },
      );
  }
}
