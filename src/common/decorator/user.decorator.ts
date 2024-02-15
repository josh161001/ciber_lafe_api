import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// Creamos un decorador personalizado para obtener el usuario de la solicitud
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    // Obtenemos la petición de la solicitud
    const request = ctx.switchToHttp().getRequest();

    // Obtenemos el usuario de la solicitud
    const usuario = request.user;

    return data ? usuario?.[data] : usuario;
  },
);
