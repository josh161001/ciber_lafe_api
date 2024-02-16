import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async crearProducto(
    createProductoDto: CreateProductoDto,
    category_id: number,
  ): Promise<Producto> {
    const categoria = await this.categoryRepository.findOne({
      where: { id: category_id },
    });

    if (!categoria) {
      throw new NotFoundException('Categoria no encontrada');
    }

    const productoNombre = await this.productoRepository.findOne({
      where: { nombre: createProductoDto.nombre },
    });

    if (productoNombre) {
      throw new BadRequestException('El producto ya existe');
    }

    const producto = this.productoRepository.create({
      ...createProductoDto,
      category: categoria,
    });

    return this.productoRepository.save(producto);
  }

  async obtenerProductos(): Promise<Producto[]> {
    return await this.productoRepository.find({
      relations: ['category'],
    });
  }

  async obtenerProductoPorId(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    return producto;
  }

  async actualizarProducto(
    id: number,
    updateProductoDto: UpdateProductoDto,
    category_id: number,
  ): Promise<Producto> {
    const categoria = await this.categoryRepository.findOne({
      where: { id: category_id },
    });

    if (!categoria) {
      throw new NotFoundException('Categoria no encontrada');
    }

    const producto = await this.productoRepository.findOne({
      where: { id },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    producto.category = categoria;

    Object.assign(producto, updateProductoDto);

    return await this.productoRepository.save(producto);
  }

  async eliminarProducto(id: number) {
    const producto = await this.productoRepository.findOne({
      where: { id },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    await this.productoRepository.delete(id);
  }
}
