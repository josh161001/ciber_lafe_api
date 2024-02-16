import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_SSL,
  DATABASE_USERNAME,
  PORT,
} from './config/config.claves';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductosModule } from './modules/productos/productos.module';
import { VentasModule } from './modules/ventas/ventas.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        database: configService.get<string>(DATABASE_NAME),
        username: configService.get<string>(DATABASE_USERNAME),
        password: configService.get<string>(DATABASE_PASSWORD),
        port: parseInt(configService.get<string>(DATABASE_PORT), 10),
        host: configService.get<string>(DATABASE_HOST),
        synchronize: true,
        autoLoadEntities: true,
        ssl: configService.get<string>(DATABASE_SSL) === 'true',
        extra: {
          ssl:
            configService.get<string>(DATABASE_SSL) === 'true'
              ? { rejectUnauthorized: false }
              : null,
        },
        dropSchema: false,
        entities: ['dist/**/*/*.entity{.ts,.js}'],
      }),
    }),
    AuthModule,
    UsersModule,
    ProductosModule,
    VentasModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number | string;
  constructor(private readonly configService: ConfigService) {
    AppModule.port = this.configService.get(PORT);
  }
}
