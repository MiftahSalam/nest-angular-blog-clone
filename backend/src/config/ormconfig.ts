import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export = [
  {
    name: 'default',
    type: 'postgres',
    host:
      process.env.NODE_ENV === 'production'
        ? process.env.DATABASE_HOST
        : 'localhost',
    port:
      process.env.NODE_ENV === 'production'
        ? parseInt(process.env.DATABASE_PORT)
        : 5432,
    username:
      process.env.NODE_ENV === 'production'
        ? process.env.DATABASE_USERNAME
        : 'postgres',
    password:
      process.env.NODE_ENV === 'production'
        ? process.env.DATABASE_PASSWORD
        : 'postgres',
    database:
      process.env.NODE_ENV === 'production'
        ? process.env.DATABASE_NAME
        : 'ng_nest_blog',
    entities: [
      join(__dirname, '..', '/**/*.entity{.ts,.js}'),
      'dist/**/*.entity{.ts,.js}',
    ],
    synchronize: false,
    logging: !!process.env.DATABASE_ENABLE_LOG,
    migrations: [join(__dirname, '..', 'migrations/*{.ts,.js}')],
    cli: {
      entitiesDir: 'src',
      migrationsDir: 'src/migrations',
    },
    ssl: process.env.NODE_ENV === 'production',
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  } as TypeOrmModuleOptions,
];
