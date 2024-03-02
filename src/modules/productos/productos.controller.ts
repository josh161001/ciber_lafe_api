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
import { Auth } from 'src/common/decorator/auth.decorator';
import { Resources } from 'src/app.roles';

@ApiTags('productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Auth({
    resource: Resources.productos,
    action: 'create',
    possession: 'own',
  })
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

  @Auth({
    resource: Resources.productos,
    action: 'read',
    possession: 'own',
  })
  @Get()
  async findAll() {
    const data = await this.productosService.obtenerProductos();

    return {
      mensaje: 'Productos encontrados',
      data,
    };
  }

  @Auth({
    resource: Resources.productos,
    action: 'read',
    possession: 'own',
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.productosService.obtenerProductoPorId(id);

    return {
      mensaje: 'Producto encontrado',
      data,
    };
  }

  @Auth({
    resource: Resources.productos,
    action: 'update',
    possession: 'own',
  })
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

  @Auth({
    resource: Resources.productos,
    action: 'delete',
    possession: 'own',
  })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const data = await this.productosService.eliminarProducto(id);

    return {
      mensaje: 'Producto eliminado',
      data,
    };
  }
}
