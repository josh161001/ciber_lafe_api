import {
  Column,
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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_venta: Date;

  @Column({ type: 'float' })
  total_venta: number;

  @Column('jsonb', { nullable: true })
  venta_productos: { producto_id: number; cantidad: number }[];

  @ManyToOne(() => User, (user) => user.ventas)
  @JoinColumn({ name: 'user_id' })
  usuario: User;
}
