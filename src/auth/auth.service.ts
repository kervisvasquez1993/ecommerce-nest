import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt"
import { LoginUserDto, CreateUserDto } from './dto';
import { IJwtPayload } from './interfaces/jwt-payload.interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService

  ) { }
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto
      const user = this.userRepository.create({ ...userData, password: bcrypt.hashSync(password, 10) });
      await this.userRepository.save(user);
      delete user.password
      return { ...user, token: this.getJWT({ id: user.id }) }
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true , id : true}
    })
    if (!user) {

      throw new UnauthorizedException("Credenciales are not valid(Email)")
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException("Credenciales are not valid(Password)")
    }


    return { ...user, token: this.getJWT({ id: user.id }) }



  }

  private getJWT(payload: IJwtPayload) {
    const token = this.jwtService.sign(payload)
    return token

  }
  private handleDBError(error: any): never {
    if (error.code === "23505") {
      throw new BadRequestException(error.detail)
    }

    throw new InternalServerErrorException("Please check serv logs")
  }
}
