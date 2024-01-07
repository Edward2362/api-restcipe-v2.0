import { Injectable, HttpStatus, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Customer } from "../../Models/Customer/customer.schema";
import { Model } from "mongoose";
import { MessageResponse } from "../../Models/MessageResponse/message-response.model";
import { AuthenticationDTO } from "../../Models/Customer/authentication.dto";
import * as bcrypt from "bcrypt";
import { HASHING_SALT } from "../../Config/constant";

@Injectable()
export class CustomerService {
    constructor(@InjectModel(Customer.name) private customerModel: Model<Customer>) {}

    async getCustomerData(customerId: string): Promise<Customer> {
        return await this.customerModel.findOne({_id: customerId}).exec();
    }
}