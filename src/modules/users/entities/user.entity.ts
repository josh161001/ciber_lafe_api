import { AppRoles } from 'src/app.roles';
import { Asistencia } from 'src/modules/asistencia/entities/asistencia.entity';
import { Venta } from 'src/modules/ventas/entities/venta.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  direccion: string;

  @Column({ type: 'bigint', nullable: true })
  telefono: number;

  @Column({ type: 'varchar', length: 60, nullable: false })
  contraseña: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'simple-array',
    nullable: false,
    default: AppRoles.USER,
  })
  roles: string[];

  @OneToMany(() => Venta, (venta) => venta.usuario, {
    onDelete: 'SET NULL',
  })
  ventas: Venta[];

  @OneToMany(() => Asistencia, (asistencia) => asistencia.user, {})
  asitencias: Asistencia[];
}
