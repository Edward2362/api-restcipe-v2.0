import { Controller, Post, Body, InternalServerErrorException, HttpStatus, NotFoundException, BadRequestException, HttpCode, UseFilters } from "@nestjs/common";
import { AuthenticationService } from "../../Services/Authentication/authentication.service";
import { AuthenticationDTO } from "../../Models/Customer/authentication.dto";
import { MessageResponse } from "../../Models/MessageResponse/message-response.model";
import { CustomerResponse } from "../../Models/Customer/customer-response.model";
import { HttpExceptionFilter } from "../../SharedActions/Filters/http-exception.filter";
import { INPUT_CUSTOMER_EMAIL_MESSAGE, INPUT_CUSTOMER_PASSWORD_MESSAGE } from "../../Config/constant";
import { ApiOkResponse } from "@nestjs/swagger";
import { ApiOkMessageResponse } from "../../SharedActions/Decorators/MessageResponse/message-response.decorator";

@Controller("authentication")
export class AuthenticationController {
    constructor(private authenticationService: AuthenticationService) {}

    @Post("login")
    @UseFilters(new HttpExceptionFilter())
    @ApiOkMessageResponse(CustomerResponse)
    @HttpCode(HttpStatus.OK)
    async login(@Body() authenticationDTO: AuthenticationDTO): Promise<MessageResponse<CustomerResponse>> {
        if (authenticationDTO.customerEmail === undefined) {
            throw new BadRequestException(INPUT_CUSTOMER_EMAIL_MESSAGE);
        }

        if (authenticationDTO.customerPassword === undefined) {
            throw new BadRequestException(INPUT_CUSTOMER_PASSWORD_MESSAGE);
        }
        
        let customerResponse: CustomerResponse = await this.authenticationService.login(authenticationDTO);
        let messageResponse: MessageResponse<CustomerResponse> = new MessageResponse<CustomerResponse>();
            
        messageResponse.statusCode = HttpStatus.OK;
        messageResponse.data = customerResponse;
        messageResponse.message = "";

        return messageResponse;
    }

    @Post("register")
    @UseFilters(new HttpExceptionFilter())
    @ApiOkMessageResponse(CustomerResponse)
    @HttpCode(HttpStatus.OK)
    async register(@Body() authenticationDTO: AuthenticationDTO): Promise<MessageResponse<CustomerResponse>> {
        if (authenticationDTO.customerEmail === undefined) {
            throw new BadRequestException(INPUT_CUSTOMER_EMAIL_MESSAGE);
        }

        if (authenticationDTO.customerPassword === undefined) {
            throw new BadRequestException(INPUT_CUSTOMER_PASSWORD_MESSAGE);
        }
        
        let customerResponse: CustomerResponse = await this.authenticationService.register(authenticationDTO);
        let messageResponse: MessageResponse<CustomerResponse> = new MessageResponse<CustomerResponse>();
        
        messageResponse.statusCode = HttpStatus.OK;
        messageResponse.data = customerResponse;
        messageResponse.message = "";
            
        return messageResponse;
    }
}