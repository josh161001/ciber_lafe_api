import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { hash } from 'bcrypt';
import { User } from './modules/users/entities/user.entity';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  const userRepository = dataSource.getRepository(User);

  app.enableCors();

  //logica para crear un usuario por defecto
  const usuarioPorDefecto = {
    nombre: 'admin',
    email: 'admin@admin.com',
    direccion: 'calle 123',
    telefono: 8112345678,
    contraseña: await hash('admin', 10),
  };

  const emailExiste = await userRepository.findOne({
    where: { email: usuarioPorDefecto.email },
  });

  if (!emailExiste) {
    await userRepository.save(userRepository.create(usuarioPorDefecto));
  }

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Cibercafe la fe')
    .setDescription('API para el sistema de ventas de cibercarfe la fe')
    .setVersion('1.0')
    .addTag('cibercafe')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Cibercafe la fe',
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  });

  await app.listen(AppModule.port);
}
bootstrap();
