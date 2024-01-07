import { Controller, Get, Request, HttpCode, HttpStatus, UseFilters, UseGuards, NotFoundException } from "@nestjs/common";
import { CustomerService } from "../../Services/Customer/customer.service";
import { HttpExceptionFilter } from "../../SharedActions/Filters/http-exception.filter";
import { AuthenticationGuard } from "../../Guards/authentication.guard";
import { CustomerResponse } from "../../Models/Customer/customer-response.model";
import { Customer } from "../../Models/Customer/customer.schema";
import { MessageResponse } from "../../Models/MessageResponse/message-response.model";
import { ID_IS_NOT_FOUND_MESSAGE } from "../../Config/constant";
import { CustomerRequest } from "../../SharedActions/Decorators/Customer/customer-request.decorator";
import { ApiOkMessageResponse } from "../../SharedActions/Decorators/MessageResponse/message-response.decorator";
import { ApiHeader, ApiSecurity } from "@nestjs/swagger";

@Controller("customer")
export class CustomerController {
    constructor(private customerService: CustomerService) {}

    @Get("getData")
    @UseFilters(new HttpExceptionFilter())
    @UseGuards(AuthenticationGuard)
    @ApiHeader({name: "x-access-token", required: true})
    @ApiSecurity("Jwt-Authentication")
    @ApiOkMessageResponse(CustomerResponse)
    @HttpCode(HttpStatus.OK)
    async getData(@CustomerRequest("customerId") customerId: string, @CustomerRequest("token") token: string): Promise<MessageResponse<CustomerResponse>> {
        const customer: Customer = await this.customerService.getCustomerData(customerId);

        if (customer === null) {
            throw new NotFoundException(ID_IS_NOT_FOUND_MESSAGE);
        }

        const customerResponse: CustomerResponse = {
            customerEmail: customer.customerEmail,
            customerFirstName: customer.customerFirstName,
            customerLastName: customer.customerLastName,
            token: token
        } as CustomerResponse;

        const messageResponse: MessageResponse<CustomerResponse> = {
            statusCode: HttpStatus.OK,
            data: customerResponse,
            message: ""
        } as MessageResponse<CustomerResponse>;

        return messageResponse;
    }
}