import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common/pipes';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //CORS
  const CorsOptions:CorsOptions= {
    origin:'*',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Autorization',
  }

  app.enableCors(CorsOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
    })
  );
  await app.listen(process.env.PORT);
}
bootstrap();
