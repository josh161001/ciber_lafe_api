import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

export interface BuscarUsuario {
  id?: string;
  email?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //crea un usuario
  async crearUsuario(createUserDto: CreateUserDto): Promise<User> {
    const emailExiste = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (emailExiste) {
      throw new BadRequestException('El email ya está registrado');
    }

    const usuario = this.userRepository.create(createUserDto);

    //encripta la contraseña del usuario y lo guarda
    const nuevoUsuario = this.userRepository.save({
      ...usuario,
      contraseña: await hash(usuario.contraseña, 10),
    });

    delete (await nuevoUsuario).contraseña;

    return nuevoUsuario;
  }

  async ObtenerTodosLosUsuarios(): Promise<User[]> {
    const usuarios = await this.userRepository.find();

    usuarios.map((usuario) => {
      delete usuario.contraseña;
    });

    return usuarios;
  }

  //busca usuario por id
  async buscarUsuarioPorId(id: string): Promise<User> {
    const usuario = await this.userRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException('El usuario no existe');
    }

    delete usuario.contraseña;

    return usuario;
  }

  //actualiza usuario por id
  async actualizarUsuario(id: string, updateUserDto: UpdateUserDto) {
    const usuario = await this.userRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException('El usuario no existe');
    }

    Object.assign(usuario, updateUserDto);

    const { contraseña, ...resto } = usuario;

    return await this.userRepository.save(resto);
  }

  //elimina usuario por id
  async eliminarUsuario(id: string) {
    const usuario = await this.userRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException('El usuario no existe');
    }

    await this.userRepository.delete(id);
  }

  //buscca usuario por email o id
  async buscarUsuario(data: BuscarUsuario): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where(data)
      .addSelect('user.contraseña')
      .getOne();
  }
}
