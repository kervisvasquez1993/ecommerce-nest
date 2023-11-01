import { UseGuards, applyDecorators } from '@nestjs/common';
import { ValidRole } from '../interfaces/valid-role';
import { RoleProtected } from './role-protected/role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

export function Auth(...roles: ValidRole[]) {
  console.log("llamado")
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}