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

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const data = this.usersService.crearUsuario(createUserDto);

    return {
      mensaje: 'Usuario creado',
      data,
    };
  }

  @Get()
  async buscarTodos() {
    const data = await this.usersService.ObtenerTodosLosUsuarios();

    return {
      mensaje: 'Usuarios encontrados',
      data,
    };
  }

  @Get(':id')
  async buscarUno(@Param('id') id: string) {
    const data = await this.usersService.buscarUsuarioPorId(id);

    return {
      mensaje: 'Usuario encontrado',
      data,
    };
  }

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

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const data = await this.usersService.eliminarUsuario(id);

    return {
      mensaje: 'Usuario eliminado',
      data,
    };
  }
}
