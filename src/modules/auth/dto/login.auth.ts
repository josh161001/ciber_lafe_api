import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@admin.com',
    description: 'El email del usuario',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'admin',
    description: 'La contraseña del usuario',
  })
  @IsString()
  @IsNotEmpty()
  contraseña: string;
}
