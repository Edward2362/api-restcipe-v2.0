import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Customer, CustomerSchema } from "../../Models/Customer/customer.schema";
import { CustomerService } from "../../Services/Customer/customer.service";
import { CustomerController } from "../../Controllers/Customer/customer.controller";

@Module({
    imports: [MongooseModule.forFeature([{name: Customer.name, schema: CustomerSchema}])],
    controllers: [CustomerController],
    providers: [CustomerService]
})
export class CustomerModule {}