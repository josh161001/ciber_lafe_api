import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export class CreateAsistenciaDto {
  @ApiProperty({
    example: new Date(),
    description: 'Fecha de entrada asistencia',
    required: true,
  })
  @IsDate()
  hora_entrada: Date;
}
