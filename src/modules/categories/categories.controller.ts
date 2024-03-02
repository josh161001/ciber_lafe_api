import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorator/auth.decorator';
import { Resources } from 'src/app.roles';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Auth({
    resource: Resources.categories,
    action: 'create',
    possession: 'any',
  })
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const data = await this.categoriesService.crearCategoria(createCategoryDto);

    return {
      mensaje: 'Categoria creada',
      data,
    };
  }

  @Auth({
    resource: Resources.categories,
    action: 'read',
    possession: 'own',
  })
  @Get()
  async findAll() {
    const data = await this.categoriesService.obtenerCategorias();

    return {
      mensaje: 'Categorias encontradas',
      data,
    };
  }

  @Auth({
    resource: Resources.categories,
    action: 'read',
    possession: 'own',
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.categoriesService.obtenerCategoriaPorId(id);

    return {
      mensaje: 'Categoria encontrada',
      data,
    };
  }

  @Auth({
    resource: Resources.categories,
    action: 'update',
    possession: 'any',
  })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const data = await this.categoriesService.actualizarCategoria(
      id,
      updateCategoryDto,
    );

    return {
      mensaje: 'Categoria actualizada',
      data,
    };
  }

  @Auth({
    resource: Resources.categories,
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const data = await this.categoriesService.eliminarCategoria(id);

    return {
      mensaje: 'Categoria eliminada',
      data,
    };
  }
}
