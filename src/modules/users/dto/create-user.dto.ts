import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  email: string;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  direccion: string;

  @IsNotEmpty()
  @IsNumber()
  telefono: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  contraseña: string;
}
