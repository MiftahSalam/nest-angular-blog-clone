import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import ormconfig = require('./config/ormconfig');
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './core/allexception.filter';

// console.log(ormconfig);

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig[0]), AuthModule, UserModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
