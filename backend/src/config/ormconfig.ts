import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export = [
  {
    name: 'default',
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'ng_nest_blog',
    entities: [
      join(__dirname, '..', '/**/*.entity{.ts,.js}'),
      'dist/**/*.entity{.ts,.js}',
    ],
    synchronize: false,
    logging: true,
    migrations: [
      join(__dirname, '..', 'migrations/*{.ts,.js}'),
      //   'src/migrations/**/*{.ts,.js}',
    ],
    // migrations: ['src/migrations/**/*{.ts,.js}'],
    cli: {
      entitiesDir: 'src',
      migrationsDir: 'src/migrations',
    },
  } as TypeOrmModuleOptions,
];
