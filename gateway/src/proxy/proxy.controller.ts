import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001';

const proxy = createProxyMiddleware({
  target: BACKEND,
  changeOrigin: true,
  on: {
    error: (_err, _req, res: any) => {
      res.status(502).json({ statusCode: 502, message: 'Backend indisponível' });
    },
  },
});

@Controller('*')
export class ProxyController {
  @All()
  forward(@Req() req: Request, @Res() res: Response) {
    proxy(req, res, () => {});
  }
}
