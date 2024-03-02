import { Injectable } from '@nestjs/common';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Asistencia } from './entities/asistencia.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AsistenciaService {
  constructor(
    @InjectRepository(Asistencia)
    private readonly asistenciaRepository: Repository<Asistencia>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async crearAsistencia(createAsistenciaDto: CreateAsistenciaDto, user: User) {
    const asistencia = this.asistenciaRepository.create({
      ...createAsistenciaDto,
      user,
    });

    delete asistencia.user.contraseña;
    delete asistencia.user.direccion;
    delete asistencia.user.telefono;
    delete asistencia.user.email;
    delete asistencia.user.roles;

    return await this.asistenciaRepository.save(asistencia);
  }

  async obtenerAsistencias() {
    return await this.asistenciaRepository.find();
  }

  async obtenerAsistencia(id: number) {
    return await this.asistenciaRepository.findOne({ where: { id } });
  }

  async actualizarAsistencia(
    id: number,
    updateAsistenciaDto: UpdateAsistenciaDto,
  ) {
    return await this.asistenciaRepository.update(id, updateAsistenciaDto);
  }

  async eliminarAsistencia(id: number) {
    return await this.asistenciaRepository.delete(id);
  }
}
