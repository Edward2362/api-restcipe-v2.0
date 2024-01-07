import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const CustomerRequest = createParamDecorator((data: string, executionContext: ExecutionContext) => {
    const request: Request = executionContext.switchToHttp().getRequest();
    const customer = request["customer"];
    return data ? customer?.[data] : customer;
});