// ventas.service.ts

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { Producto } from '../productos/entities/producto.entity'; // Asegúrate de ajustar la ruta según tu estructura de carpetas
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async crearVenta(createVentaDto: CreateVentaDto, user: User): Promise<Venta> {
    const venta = new Venta();
    venta.fecha_venta = createVentaDto.fecha_venta;
    venta.total_venta = createVentaDto.total_venta;
    venta.usuario = user;

    venta.venta_productos = await Promise.all(
      createVentaDto.venta_productos.map(async (productoVenta) => {
        // Verificar que el producto exista en la base de datos por id
        const producto = await this.productoRepository.findOne({
          where: { id: productoVenta.producto_id },
        });

        if (!producto) {
          throw new NotFoundException('Producto no encontrado');
        }

        // Verificar que haya suficiente existencia para el producto
        if (productoVenta.cantidad > producto.cantidad_producto) {
          throw new NotFoundException(
            `No hay suficiente existencia para el producto ${producto.nombre}`,
          );
        }

        // Actualizar la existencia del producto
        producto.cantidad_producto -= productoVenta.cantidad;

        try {
          // Guardar el producto con la nueva existencia
          await this.productoRepository.save(producto);
        } catch (error) {
          throw new BadRequestException(
            `Error al actualizar la existencia del producto ${producto.nombre}`,
          );
        }

        return {
          producto_id: producto.id,
          cantidad: productoVenta.cantidad,
        };
      }),
    );

    delete venta.usuario.contraseña;
    delete venta.usuario.email;
    delete venta.usuario.roles;
    delete venta.usuario.telefono;
    delete venta.usuario.direccion;

    try {
      return await this.ventaRepository.save(venta);
    } catch (error) {
      throw new BadRequestException('Error al crear la venta');
    }
  }

  async obtenerVentas(): Promise<Venta[]> {
    const ventas = await this.ventaRepository.find();

    if (!ventas) {
      throw new NotFoundException('No hay ventas');
    }

    const ventasConProductos = await Promise.all(
      ventas.map(async (venta) => {
        const productosVendidos = await Promise.all(
          venta.venta_productos.map(async (productoVendido) => {
            const producto = await this.productoRepository.findOne({
              where: { id: productoVendido.producto_id },
            });
            return { ...productoVendido, producto };
          }),
        );
        delete venta.usuario.contraseña;
        venta.venta_productos = productosVendidos;
        return venta;
      }),
    );

    return ventasConProductos;
  }

  async obtenerVentaConProductos(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({ where: { id } });

    if (!venta) {
      throw new NotFoundException(`Venta con id ${id} no encontrada`);
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

    delete venta.usuario.contraseña;
    // Actualizar venta_productos con los datos completos de los productos
    venta.venta_productos = productosVendidos;
    return venta;
  }

  async actualizarVenta(
    id: number,
    updateVentaDto: UpdateVentaDto,
  ): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({ where: { id } });

    if (!venta) {
      throw new NotFoundException(`Venta con id ${id} no encontrada`);
    }

    venta.fecha_venta = updateVentaDto.fecha_venta;
    venta.total_venta = updateVentaDto.total_venta;

    const productoVenta = await Promise.all(
      updateVentaDto.venta_productos.map(async (productoVenta) => {
        const producto = await this.productoRepository.findOne({
          where: { id: productoVenta.producto_id },
        });

        if (!producto) {
          throw new NotFoundException(
            `El producto ${producto.nombre} no fue encontrado`,
          );
        }

        // verifica que el id y la cantidad del producto existan en la venta
        // si no existe, se asgina un valor de 0
        const cantidadActualVenta =
          venta.venta_productos.find(
            (ventaProducto) => ventaProducto.producto_id === producto.id,
          )?.cantidad || 0;

        //calcula la diferencia entre la  cantidad actual de la venta y
        // la nueva cantidad que se quiere asignar
        const nuevaCantidad = cantidadActualVenta - productoVenta.cantidad;

        //veriiica que la cantidad del producto sea mayor a 0
        if (nuevaCantidad > 0) {
          //si la cantidad es mayor a 0, se le suma la diferencia a la cantidad del producto
          producto.cantidad_producto += nuevaCantidad;

          // si la cantidad es menor a 0 && la cantidad absoluta es menor o igual a la cantidad del producto
          // se le resta la cantidad absoluta a la cantidad del producto
        } else if (
          nuevaCantidad < 0 &&
          Math.abs(nuevaCantidad) <= producto.cantidad_producto
        ) {
          //Math.abs(nuevaCantidad) retorna un numero positivo siempre
          producto.cantidad_producto -= Math.abs(nuevaCantidad);
        } else {
          throw new NotFoundException(
            `No hay suficiente existencia para el producto ${producto.nombre}`,
          );
        }

        try {
          await this.productoRepository.save(producto);
        } catch (error) {
          throw new BadRequestException(
            `Error al actualizar la existencia del producto ${producto.nombre}`,
          );
        }

        return {
          producto_id: producto.id,
          cantidad: productoVenta.cantidad,
        };
      }),
    );

    // Actualizar la venta completa
    venta.venta_productos = productoVenta;

    try {
      return await this.ventaRepository.save(venta);
    } catch (error) {
      throw new BadRequestException('Error al actualizar la venta');
    }
  }

  async eliminarVenta(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({ where: { id } });

    if (!venta) {
      throw new NotFoundException(`Venta con id ${id} no encontrada`);
    }

    const productosVendidos = await Promise.all(
      venta.venta_productos.map(async (productoVendido) => {
        const producto = await this.productoRepository.findOne({
          where: { id: productoVendido.producto_id },
        });

        if (!producto) {
          throw new NotFoundException(
            `El producto ${producto.nombre} no fue encontrado`,
          );
        }

        // Actualizar la existencia del producto
        producto.cantidad_producto += productoVendido.cantidad;

        try {
          await this.productoRepository.save(producto);
        } catch (error) {
          throw new BadRequestException(
            `Error al actualizar la existencia del producto ${producto.nombre}`,
          );
        }
      }),
    );

    try {
      await this.ventaRepository.delete(id);
      return venta;
    } catch (error) {
      throw new BadRequestException('Error al eliminar la venta');
    }
  }
}
