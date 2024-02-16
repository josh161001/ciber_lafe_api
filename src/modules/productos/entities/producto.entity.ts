import { Category } from 'src/modules/categories/entities/category.entity';
import { Venta } from 'src/modules/ventas/entities/venta.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_caducidad: Date;

  @Column({ type: 'int' })
  cantidad_producto: number;

  @Column({ type: 'float' })
  precio_venta: number;

  @ManyToOne(() => Category, (category) => category.producto)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
