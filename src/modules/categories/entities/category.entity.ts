import { Producto } from 'src/modules/productos/entities/producto.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @OneToMany(() => Producto, (producto) => producto.category, {
    onDelete: 'SET NULL',
  })
  producto: Producto[];
}
