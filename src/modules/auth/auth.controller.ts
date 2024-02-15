import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.auth';
import { User as UserEntity } from '../users/entities/user.entity';
import { User } from 'src/common/decorator/user.decorator';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @User() user: UserEntity) {
    try {
      const data = await this.authService.login(user);

      return {
        message: 'Usuario logueado correctamente',
        data,
      };
    } catch (error) {
      throw new UnauthorizedException('Las credenciales no coinciden');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@User() user: UserEntity) {
    const { contraseña, ...resto } = user;

    return {
      message: 'token del usuario autenticado',
      data: resto,
    };
  }
}
