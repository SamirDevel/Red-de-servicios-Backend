import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common/pipes';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AuthGuard } from './interceptors/sessions interceptors/auth.guard';
import * as session from 'express-session'

const witheList = ['http://192.168.1.89:3001']
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //CORS
  const CorsOptions:CorsOptions= {
    origin:function(origin, callback){
      if(witheList.indexOf(origin)!=-1)callback(null, true)
      else callback(new Error('IP no permitida'))
    },
    methods: '*',
    credentials:true,
    allowedHeaders: '*',
  }
  app.enableCors(CorsOptions);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
    })
  );
  //cookies
  app.use(session({
    secret:'corp',
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:1000*60*60, httpOnly:false, sameSite:true},
  }))
  app.useGlobalGuards(new AuthGuard)
  //app.use(cookieSession({
  //  keys:['corp'],
  //  isSecureContext:true,
  //}))
  const server = await app.listen(process.env.PORT);
}
bootstrap();
