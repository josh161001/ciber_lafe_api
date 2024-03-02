import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorator/auth.decorator';
import { User } from 'src/common/decorator/user.decorator';
import { User as UserEntity } from '../users/entities/user.entity';
import { Resources } from 'src/app.roles';

@ApiTags('ventas')
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Auth({
    resource: Resources.ventas,
    action: 'create',
    possession: 'own',
  })
  @Post()
  async create(
    @Body() createVentaDto: CreateVentaDto,
    @User() user: UserEntity,
  ) {
    const data = await this.ventasService.crearVenta(createVentaDto, user);

    return {
      message: 'Venta creada',
      data,
    };
  }

  @Auth({
    resource: Resources.ventas,
    action: 'read',
    possession: 'own',
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.ventasService.obtenerVentaConProductos(id);

    return {
      message: 'Venta encontrada',
      data,
    };
  }

  @Auth({
    resource: Resources.ventas,
    action: 'read',
    possession: 'own',
  })
  @Get()
  async findAll() {
    const data = await this.ventasService.obtenerVentas();

    return {
      message: 'Ventas encontradas',
      data,
    };
  }

  @Auth({
    resource: Resources.ventas,
    action: 'update',
    possession: 'own',
  })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateVentaDto: UpdateVentaDto,
  ) {
    const data = await this.ventasService.actualizarVenta(id, updateVentaDto);

    return {
      message: 'Venta actualizada',
      data,
    };
  }

  @Auth({
    resource: Resources.ventas,
    action: 'delete',
    possession: 'own',
  })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const data = await this.ventasService.eliminarVenta(id);

    return {
      message: 'Venta eliminada',
      data,
    };
  }
}
