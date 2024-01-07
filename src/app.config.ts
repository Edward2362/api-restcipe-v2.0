import { ConfigInitModule } from "./Config/config-init.module";
import { DatabaseModule } from "./Database/database.module";
import { AuthenticationModule } from "./Modules/Authentication/authentication.module";
import { CustomerModule } from "./Modules/Customer/customer.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

export const imports = [
    ConfigInitModule,
    DatabaseModule,
    AuthenticationModule,
    CustomerModule
];

export const controllers = [
    AppController
];

export const providers = [
    AppService
];