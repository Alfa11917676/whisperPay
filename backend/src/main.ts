import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: false });
  app.use(json({ limit: '1mb' }));
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })
  );

  const config = app.get(ConfigService);
  const port = Number(config.get('PORT')) || 3000;
  await app.listen(port);
}

bootstrap();
