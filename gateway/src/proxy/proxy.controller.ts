import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as http from 'http';
import * as https from 'https';
import { URL } from 'url';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001';

@Controller('*')
export class ProxyController {
  @All()
  forward(@Req() req: Request, @Res() res: Response) {
    const target = new URL(BACKEND);
    const isHttps = target.protocol === 'https:';
    const transport = isHttps ? https : http;

    // NestJS body-parser already consumed req stream; rebuild body from req.body
    const rawBody = req.body && Object.keys(req.body).length > 0
      ? Buffer.from(JSON.stringify(req.body))
      : null;

    const headers: Record<string, any> = { ...req.headers, host: target.host };
    if (rawBody) {
      headers['content-length'] = rawBody.length;
      headers['content-type'] = 'application/json';
    } else {
      delete headers['content-length'];
    }

    const options: http.RequestOptions = {
      hostname: target.hostname,
      port: parseInt(target.port) || (isHttps ? 443 : 80),
      path: req.url,
      method: req.method,
      headers,
    };

    const proxyReq = transport.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers as any);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', () => {
      if (!res.headersSent) {
        res.status(502).json({ statusCode: 502, message: 'Backend indisponível' });
      }
    });

    if (rawBody) {
      proxyReq.end(rawBody);
    } else {
      proxyReq.end();
    }
  }
}
