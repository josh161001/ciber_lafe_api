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

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const data = await this.categoriesService.crearCategoria(createCategoryDto);

    return {
      mensaje: 'Categoria creada',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.categoriesService.obtenerCategorias();

    return {
      mensaje: 'Categorias encontradas',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.categoriesService.obtenerCategoriaPorId(id);

    return {
      mensaje: 'Categoria encontrada',
      data,
    };
  }

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

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const data = await this.categoriesService.eliminarCategoria(id);

    return {
      mensaje: 'Categoria eliminada',
      data,
    };
  }
}
