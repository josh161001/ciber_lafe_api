// venta.dto.ts

import { IsDate, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductoVentaDto {
  @IsNumber()
  producto_id: number;

  @IsNumber()
  cantidad: number;
}

export class CreateVentaDto {
  @ApiProperty({ example: new Date() })
  @IsDate()
  fecha_venta: Date;

  @ApiProperty({ example: 100 })
  @IsNumber()
  total_venta: number;

  @ApiProperty({
    type: [ProductoVentaDto],
    example: [{ producto_id: 1, cantidad: 2 }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductoVentaDto)
  venta_productos: ProductoVentaDto[];
}
