import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  async create(
    @Body() createProductoDto: CreateProductoDto,
    @Body('category_id') category_id: number,
  ) {
    const data = await this.productosService.crearProducto(
      createProductoDto,
      category_id,
    );

    return {
      mensaje: 'Producto creado',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.productosService.obtenerProductos();

    return {
      mensaje: 'Productos encontrados',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.productosService.obtenerProductoPorId(id);

    return {
      mensaje: 'Producto encontrado',
      data,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProductoDto: UpdateProductoDto,
    @Body('category_id') category: number,
  ) {
    const data = await this.productosService.actualizarProducto(
      id,
      updateProductoDto,
      category,
    );

    return {
      mensaje: 'Producto actualizado',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const data = await this.productosService.eliminarProducto(id);

    return {
      mensaje: 'Producto eliminado',
      data,
    };
  }
}
