import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthenticationController } from "../../Controllers/Authentication/authentication.controller";
import { AuthenticationService } from "../../Services/Authentication/authentication.service";
import { CustomerModule } from "../../Modules/Customer/customer.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Customer, CustomerSchema } from "../../Models/Customer/customer.schema";

@Module({
    imports: [JwtModule.register({
        global: true,
        secret: process.env.TOKEN_KEY,
        signOptions: {
            expiresIn: "1h"
        }
    }), MongooseModule.forFeature([{name: Customer.name, schema: CustomerSchema}])],
    controllers: [AuthenticationController],
    providers: [AuthenticationService]
})
export class AuthenticationModule {}