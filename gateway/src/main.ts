import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`Gateway rodando em http://localhost:${port}`);
  console.log(`Encaminhando para backend em ${process.env.BACKEND_URL || 'http://localhost:3001'}`);
}
bootstrap();
