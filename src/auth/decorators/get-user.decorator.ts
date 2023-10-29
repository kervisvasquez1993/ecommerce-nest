import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        console.log("holaaa")
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;
        if (!user) {
            throw new InternalServerErrorException("User not Fount (request)")
        }
        return user
    }
);