import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorator/auth.decorator';
import { Resources } from 'src/app.roles';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth({
    resource: Resources.users,
    action: 'create',
    possession: 'any',
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.crearUsuario(createUserDto);

    return {
      mensaje: 'Usuario creado',
      data,
    };
  }

  @Auth({
    resource: Resources.users,
    action: 'read',
    possession: 'any',
  })
  @Get()
  async buscarTodos() {
    const data = await this.usersService.ObtenerTodosLosUsuarios();

    return {
      mensaje: 'Usuarios encontrados',
      data,
    };
  }

  @Auth({
    resource: Resources.users,
    action: 'read',
    possession: 'own',
  })
  @Get(':id')
  async buscarUno(@Param('id') id: string) {
    const data = await this.usersService.buscarUsuarioPorId(id);

    return {
      mensaje: 'Usuario encontrado',
      data,
    };
  }

  @Auth({
    resource: Resources.users,
    action: 'update',
    possession: 'own',
  })
  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const data = await this.usersService.actualizarUsuario(id, updateUserDto);

    return {
      mensaje: 'Usuario actualizado',
      data,
    };
  }

  @Auth({
    resource: Resources.users,
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const data = await this.usersService.eliminarUsuario(id);

    return {
      mensaje: 'Usuario eliminado',
      data,
    };
  }
}
