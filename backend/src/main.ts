import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Try loading .env from absolute path relative to dist/main.js
const envPath = path.resolve(__dirname, '..', '.env');
const envLoadResult = dotenv.config({ path: fs.existsSync(envPath) ? envPath : undefined });

console.log('--- BACKEND DEBUG INFO ---');
console.log('Current Directory (cwd):', process.cwd());
console.log('Looking for .env at:', envPath);
console.log('.env exists:', fs.existsSync(envPath));
console.log('Dotenv parsed:', envLoadResult.parsed ? Object.keys(envLoadResult.parsed) : 'None');
console.log('DATABASE_URL in process.env:', process.env.DATABASE_URL);
console.log('--------------------------');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

