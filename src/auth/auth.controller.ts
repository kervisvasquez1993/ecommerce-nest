import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, CreateUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRole } from './interfaces/valid-role';
import { Auth } from './decorators/auth.decorators';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  @Post("login")
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get("private")
  @UseGuards(AuthGuard())
  testingPrivateRoute(@GetUser("email") user: User) {
    return {
      ok: true,
      messages: "hola mundo desde private",
      user
    }
  }

  @Get("private2")
  @RoleProtected(ValidRole.superadmin, ValidRole.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRouter(@GetUser() user: User) {
    return {
      ok: true,
      user
    }
  }
  @Get("private3")
  @Auth(ValidRole.superadmin)
  privateRouter3(@GetUser() user: User) {
    return {
      ok: true,
      user
    }
  }

}
