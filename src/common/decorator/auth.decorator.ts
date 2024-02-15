import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

//decorador para proteger las rutas con jwt y roles con nest-access-control
export function Auth() {
  return applyDecorators(UseGuards(AuthGuard('jwt')), ApiBearerAuth());
}
