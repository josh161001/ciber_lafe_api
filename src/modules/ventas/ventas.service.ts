// ventas.service.ts

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { Producto } from '../productos/entities/producto.entity'; // Asegúrate de ajustar la ruta según tu estructura de carpetas
import { CreateVentaDto } from './dto/create-venta.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async crearVenta(createVentaDto: CreateVentaDto): Promise<Venta> {
    const venta = new Venta();
    venta.fecha_venta = createVentaDto.fecha_venta;
    venta.total_venta = createVentaDto.total_venta;

    venta.venta_productos = await Promise.all(
      createVentaDto.venta_productos.map(async (productoVenta) => {
        const producto = await this.productoRepository.findOne({
          where: { id: productoVenta.producto_id },
        });

        if (!producto) {
          throw new BadRequestException('Producto no encontrado');
        }

        return {
          producto_id: producto.id, // Asumiendo que producto tiene una propiedad "id"
          cantidad: productoVenta.cantidad,
        };
      }),
    );

    try {
      return await this.ventaRepository.save(venta);
    } catch (error) {
      throw new BadRequestException('Error al crear la venta');
    }
  }

  async obtenerVentaConProductos(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({ where: { id } });

    if (!venta) {
      throw new NotFoundException('Venta no encontrada');
    }

    // Cargar los datos completos de los productos vendidos
    const productosVendidos = await Promise.all(
      venta.venta_productos.map(async (productoVendido) => {
        const producto = await this.productoRepository.findOne({
          where: { id: productoVendido.producto_id },
        });
        return { ...productoVendido, producto };
      }),
    );

    // Actualizar venta_productos con los datos completos de los productos
    venta.venta_productos = productosVendidos;

    return venta;
  }
}
