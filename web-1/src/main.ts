import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { db } from './prisma/db.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  console.log('Соединение с БД работает');
}
await bootstrap();
