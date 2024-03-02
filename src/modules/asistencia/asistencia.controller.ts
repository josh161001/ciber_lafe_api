import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
import { User } from 'src/common/decorator/user.decorator';
import { User as UserEntity } from '../users/entities/user.entity';
import { Auth } from 'src/common/decorator/auth.decorator';
import { Resources } from 'src/app.roles';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Asistencia')
@Controller('asistencia')
export class AsistenciaController {
  constructor(private readonly asistenciaService: AsistenciaService) {}

  @Auth({
    resource: Resources.asistencia,
    action: 'create',
    possession: 'own',
  })
  @Post()
  async create(
    @Body() createAsistenciaDto: CreateAsistenciaDto,
    @User() user: UserEntity,
  ) {
    const data = await this.asistenciaService.crearAsistencia(
      createAsistenciaDto,
      user,
    );

    return {
      mensaje: 'Asistencia creada',
      data,
    };
  }

  @Auth({
    resource: Resources.asistencia,
    action: 'read',
    possession: 'any',
  })
  @Get()
  async findAll() {
    return await this.asistenciaService.obtenerAsistencias();
  }

  @Auth({
    resource: Resources.asistencia,
    action: 'read',
    possession: 'any',
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.asistenciaService.obtenerAsistencia(id);
  }

  @Auth({
    resource: Resources.asistencia,
    action: 'update',
    possession: 'any',
  })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAsistenciaDto: UpdateAsistenciaDto,
  ) {
    return await this.asistenciaService.actualizarAsistencia(
      id,
      updateAsistenciaDto,
    );
  }

  @Auth({
    resource: Resources.asistencia,
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.asistenciaService.eliminarAsistencia(id);
  }
}
