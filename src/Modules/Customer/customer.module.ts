import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Customer, CustomerSchema } from "../../Models/Customer/customer.schema";
import { CustomerService } from "../../Services/Customer/customer.service";

@Module({
    imports: [MongooseModule.forFeature([{name: Customer.name, schema: CustomerSchema}])],
    providers: [CustomerService]
})
export class CustomerModule {}