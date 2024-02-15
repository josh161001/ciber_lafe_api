import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validarUsuario(email: string, contra: string) {
    const usuario = await this.usersService.buscarUsuario({ email });

    if (usuario && (await compare(contra, usuario.contraseña))) {
      const { contraseña, ...resto } = usuario;

      return resto;
    }

    return null;
  }

  async login(usuario: User) {
    const { id, contraseña, ...resto } = usuario;

    const payload = { sub: id };

    return {
      access_token: this.jwtService.sign(payload),
      ...resto,
    };
  }
}
