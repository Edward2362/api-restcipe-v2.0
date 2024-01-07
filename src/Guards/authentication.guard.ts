import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { BEARER_TYPE, TOKEN_IS_REQUIRED_MESSAGE, TOKEN_IS_INVALID_MESSAGE, X_ACCESS_TOKEN } from "../Config/constant";

@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(executionContext: ExecutionContext): Promise<boolean> {
        const request: Request = executionContext.switchToHttp().getRequest();
        let token: string | undefined = request.headers[X_ACCESS_TOKEN] || request.query.token || request.body.token;

        if (!token) {
            throw new UnauthorizedException(TOKEN_IS_REQUIRED_MESSAGE);
        }

        if (token.includes(BEARER_TYPE)) {
            token = token.replace(BEARER_TYPE, "");
            token = token.trim();
        }

        try {
            const { customerId } = await this.jwtService.verifyAsync(token, {
                secret: process.env.TOKEN_KEY
            });

            request["customer"] = { 
                customerId,
                token 
            };
        } catch(error) {
            throw new UnauthorizedException(TOKEN_IS_INVALID_MESSAGE);
        }

        return true;
    }
}