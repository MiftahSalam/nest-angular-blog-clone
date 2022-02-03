import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';
import { ForbiddenException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  const WHITE_LIST = JSON.parse(<string>process.env.CORS_WHITELIST) as {
    whitelist: [];
  };
  console.log(WHITE_LIST);

  app.use(
    helmet(
      {
        //debugging CSP cannot load image
        contentSecurityPolicy: false,
        /*{
          useDefaults: true,
          directives: {
            'img-src': ['*'], 
          },
        },
        */
      },
      /**/
    ),
  );
  app.enableCors({
    origin: (origin, callback) => {
      if (WHITE_LIST.whitelist.indexOf[origin] !== -1) {
        console.log('allowed cors for:', origin);
        callback(null, true);
      } else {
        console.log('blocked cors for:', origin);
        callback(new ForbiddenException('Not allowed by cors'));
      }
    },
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    credentials: true,
  });

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );
  await app.listen(port, () => {
    console.log('Application running on port', port);
  });
}
bootstrap();
