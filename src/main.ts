import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown properties
      forbidNonWhitelisted: true, // throw if unknown props are sent
      transform: true, // plain -> class (class-transformer)
    }),
  );

  await app.listen(process.env.PORT ?? 3300);

  console.log(`GraphQL ready: http://localhost:3300/graphql`);
}
void bootstrap();
