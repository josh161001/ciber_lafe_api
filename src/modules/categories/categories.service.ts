import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { Producto } from '../productos/entities/producto.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async crearCategoria(createCategoryDto: CreateCategoryDto) {
    const categoria = await this.categoryRepository.findOne({
      where: { nombre: createCategoryDto.nombre },
    });

    if (categoria) {
      throw new BadRequestException('La categoria ya existe');
    }

    const categoriaNueva = this.categoryRepository.create(createCategoryDto);

    return this.categoryRepository.save(categoriaNueva);
  }

  async obtenerCategorias(): Promise<Category[]> {
    return await this.categoryRepository.find({});
  }

  async obtenerCategoriaPorId(id: number): Promise<Category> {
    const categoria = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!categoria) {
      throw new NotFoundException('Categoria no encontrada');
    }

    return categoria;
  }

  async actualizarCategoria(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const categoria = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!categoria) {
      throw new NotFoundException('Categoria no encontrada');
    }

    Object.assign(categoria, updateCategoryDto);

    return this.categoryRepository.save(categoria);
  }

  async eliminarCategoria(id: number) {
    const categoria = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!categoria) {
      throw new NotFoundException('Categoria no encontrada');
    }

    return this.categoryRepository.delete(id);
  }
}
