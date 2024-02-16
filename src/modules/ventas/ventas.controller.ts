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

@ApiTags('ventas')
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  async create(@Body() createVentaDto: CreateVentaDto) {
    return await this.ventasService.crearVenta(createVentaDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.ventasService.obtenerVentaConProductos(id);
  }
}
