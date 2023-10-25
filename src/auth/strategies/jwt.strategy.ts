import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { IJwtPayload } from "../interfaces/jwt-payload.interfaces";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigFactory, ConfigService } from "@nestjs/config";
import { UnauthorizedException, Injectable } from '@nestjs/common';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        configService: ConfigService,
    ) {
        super({
            secretOrKey: configService.get("JWTSECRET"),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })

    }
    async validate(payload: IJwtPayload): Promise<User> {
     
        const { id } = payload
        const user = await this.userRepository.findOneBy({ id })
        
        if (!user) {
            throw new UnauthorizedException("Token not valid")
        }
        if (!user.isActive) {
            throw new UnauthorizedException("User is inactive, talk with an admin")
        }
        return user
    }
}