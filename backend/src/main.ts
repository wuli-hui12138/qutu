import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Try loading .env from absolute path relative to dist/main.js
const envPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: fs.existsSync(envPath) ? envPath : undefined });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

