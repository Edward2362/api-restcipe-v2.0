import { Injectable, HttpStatus, NotFoundException, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CustomerService } from "../../Services/Customer/customer.service";
import { AuthenticationDTO } from "../../Models/Customer/authentication.dto";
import { MessageResponse } from "../../Models/MessageResponse/message-response.model";
import { CustomerResponse } from "../../Models/Customer/customer-response.model";
import { Customer } from "../../Models/Customer/customer.schema";
import * as bcrypt from "bcrypt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { HASHING_SALT, EMAIL_IS_NOT_REGISTERED_MESSAGE, PASSWORD_IS_INCORRECT_MESSAGE, EMAIL_IS_REGISTERED_MESSAGE } from "../../Config/constant";

@Injectable()
export class AuthenticationService {
    constructor(private jwtService: JwtService, @InjectModel(Customer.name) private customerModel: Model<Customer>) {}

    async login(authenticationDTO: AuthenticationDTO): Promise<CustomerResponse> {
        const customer: Customer = await this.customerModel.findOne({customerEmail: authenticationDTO.customerEmail}).exec();

        if (customer === null) {
            throw new NotFoundException(EMAIL_IS_NOT_REGISTERED_MESSAGE);
        }
            
        if (!(await bcrypt.compare(authenticationDTO.customerPassword, customer.customerPassword))) {
            throw new BadRequestException(PASSWORD_IS_INCORRECT_MESSAGE);
        }

        let token = await this.jwtService.signAsync({customerId: customer._id});
        let customerResponse: CustomerResponse = new CustomerResponse();
        customerResponse.customerEmail = customer.customerEmail;
        customerResponse.customerFirstName = customer.customerFirstName;
        customerResponse.customerLastName = customer.customerLastName;
        customerResponse.token = token;

        return customerResponse;
    }

    async register(authenticationDTO: AuthenticationDTO): Promise<CustomerResponse> {
        const customer: Customer = await this.customerModel.findOne({customerEmail: authenticationDTO.customerEmail}).exec();
            
        if (customer !== null) {
            throw new BadRequestException(EMAIL_IS_REGISTERED_MESSAGE);
        }

        let encryptedPassword = await bcrypt.hash(authenticationDTO.customerPassword, HASHING_SALT);

        const nextCustomer =  await new this.customerModel({
            customerEmail: authenticationDTO.customerEmail,
            customerPassword: encryptedPassword,
            customerFirstName: "",
            customerLastName: ""
        }).save();

        let token = await this.jwtService.signAsync({customerId: nextCustomer._id});
        let customerResponse: CustomerResponse = new CustomerResponse();
        customerResponse.customerEmail = nextCustomer.customerEmail;
        customerResponse.customerFirstName = nextCustomer.customerFirstName;
        customerResponse.customerLastName = nextCustomer.customerLastName;
        customerResponse.token = token;

        return customerResponse;
    }
}