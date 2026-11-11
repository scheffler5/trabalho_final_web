import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Rotas que exigem papel de admin
const ADMIN_ROUTES = [
  /^\/users$/,
  /^\/users\/pending$/,
  /^\/users\/[^/]+\/status$/,
  /^\/appointments$/,
];

@Injectable()
export class RolesMiddleware implements NestMiddleware {
  use(req: Request & { user?: any }, res: Response, next: NextFunction) {
    const isAdminRoute = ADMIN_ROUTES.some((r) => r.test(req.path));

    if (isAdminRoute && req.user?.role !== 'admin') {
      return res.status(403).json({
        statusCode: 403,
        message: 'Acesso restrito a administradores',
      });
    }

    next();
  }
}
