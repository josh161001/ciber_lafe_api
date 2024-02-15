import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'contraseña',
    });
  }

  // se valida el usuario
  async validate(email: string, contraseña: string) {
    const user = await this.authService.validarUsuario(email, contraseña);

    if (!user) throw new UnauthorizedException('Las credenciales no coinciden');

    return user;
  }
}
