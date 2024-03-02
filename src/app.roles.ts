import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum Resources {
  users = 'users',
  productos = 'productos',
  ventas = 'ventas',
  categories = 'categories',
  asistencia = 'asistencia',
}

export const roles: RolesBuilder = new RolesBuilder();

roles
  .grant(AppRoles.USER)
  .readOwn([Resources.users])
  .createOwn([Resources.productos])
  .readOwn([Resources.productos])
  .updateOwn([Resources.productos])
  .deleteOwn([Resources.productos])
  .createOwn([Resources.ventas])
  .readOwn([Resources.ventas])
  .updateOwn([Resources.ventas])
  .deleteOwn([Resources.ventas])
  .readOwn([Resources.categories])
  .createOwn([Resources.asistencia])
  .readOwn([Resources.asistencia])
  .grant(AppRoles.ADMIN)
  .extend(AppRoles.USER)
  .createAny([Resources.users])
  .readAny([Resources.users])
  .updateAny([Resources.users])
  .deleteAny([Resources.users])
  .createAny([Resources.productos])
  .updateAny([Resources.productos])
  .deleteAny([Resources.productos])
  .createAny([Resources.ventas])
  .updateAny([Resources.ventas])
  .deleteAny([Resources.ventas])
  .readAny([Resources.categories])
  .createAny([Resources.categories])
  .updateAny([Resources.categories])
  .deleteAny([Resources.categories])
  .createAny([Resources.asistencia])
  .readAny([Resources.asistencia])
  .updateAny([Resources.asistencia])
  .deleteAny([Resources.asistencia]);
