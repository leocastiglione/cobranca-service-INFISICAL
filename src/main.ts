import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

import { readFileSync } from 'fs';

function loadDockerSecrets() {
  const secrets = [
    { file: 'DB_USUARIO_FILE', env: 'DB_USUARIO' },
    { file: 'DB_USUARIO_SENHA_FILE', env: 'DB_USUARIO_SENHA' },
    { file: 'COBRANCA_FILE', env: 'COBRANCA' },
    { file: 'JWT_SECRET_FILE', env: 'JWT_SECRET' },
    { file:'DATABASE_URL', env: 'DATABASE_URL'},
    { file: 'JWT_SECRET', env:'JWT_SECRET'} 
  ];

  for (const secret of secrets) {
    const filePath = process.env[secret.file];

    if (filePath) {
      process.env[secret.env] = readFileSync(filePath, 'utf8').trim();
    }
  }

  const usuario = process.env.DB_USUARIO;
  const senha = process.env.DB_USUARIO_SENHA;
  const database = process.env.COBRANCA;

  if (!usuario || !senha || !database) {
    throw new Error('Credenciais do banco não foram carregadas.');
  }

  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT || '3306';

  if (!host) {
    throw new Error('DB_HOST não configurado.');
  }

  process.env.DATABASE_URL =
    `mysql://${encodeURIComponent(usuario)}:${encodeURIComponent(senha)}@${host}:${port}/${encodeURIComponent(database)}`;
}


(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const config = app.get(ConfigService);
  const porta = config.get<number>('PORT', 3000);
  await app.listen(porta);
  Logger.log(`API no ar em http:-/localhost:${porta}`, 'Bootstrap');
  loadDockerSecrets();
}

void bootstrap();
