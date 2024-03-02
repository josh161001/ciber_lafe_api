import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Producto } from 'src/modules/productos/entities/producto.entity';

@Entity()
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  fecha_venta: Date;

  @Column({ type: 'float' })
  total_venta: number;

  @Column('jsonb', { nullable: true })
  venta_productos: { producto_id: number; cantidad: number }[];

  @ManyToOne(() => User, (user) => user.ventas, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  usuario: User;
}
