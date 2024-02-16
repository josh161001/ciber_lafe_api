import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateProductoDto {
  @ApiProperty({ example: 'Producto 1' })
  @IsString()
  @MaxLength(255)
  nombre: string;

  @ApiProperty({ example: '2021-12-31' })
  @IsDate()
  fecha_caducidad: Date;

  @ApiProperty({ example: 10 })
  @IsNumber()
  cantidad_producto: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  precio_venta: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  category_id: number;
}
