import { ExceptionFilter, Catch, HttpException, ArgumentsHost, InternalServerErrorException } from "@nestjs/common";
import { Request, Response } from "express";
import { MessageResponse } from "../../Models/MessageResponse/message-response.model";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        let messageResponse: MessageResponse<{}> = new MessageResponse<{}>();
        messageResponse.statusCode = exception.getStatus();
        messageResponse.data = {};
        messageResponse.message = exception.message;

        response.status(messageResponse.statusCode).json(messageResponse);
    }
}