import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos desconhecidos
      forbidNonWhitelisted: true, // Retorna erro se um campo não permitido for enviado
      transform: true, // Habilita a transformação automática de DTOs
      transformOptions: { enableImplicitConversion: true }, // Permite conversão implícita de tipos (ex: "10" → 10).
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  console.error(error);
});
