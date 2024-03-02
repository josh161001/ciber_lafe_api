import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { AppRoles } from 'src/app.roles';
import { enumToString } from 'src/common/enum/EnumToString.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del usuario',
    required: true,
  })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    example: 'juanito@gmail.com',
    description: 'Correo del usuario',
  })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Calle 123',
    description: 'Direccion del usuario',
  })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  direccion: string;

  @ApiProperty({
    example: 8112345678,
    description: 'Telefono del usuario',
  })
  @IsNotEmpty()
  @IsNumber()
  telefono: number;

  @ApiProperty({
    example: 'contraseña',
    description: 'Contraseña del usuario',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  contraseña: string;

  @ApiProperty({
    example: ['USER'],
    description: 'Roles del usuario',
  })
  @IsEnum(AppRoles, {
    each: true,
    message: `Los roles validos son ${enumToString(AppRoles)}`,
  })
  @IsNotEmpty()
  @IsArray()
  roles: string[];
}
