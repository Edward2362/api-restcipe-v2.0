import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./Database/database.module";
import { AuthenticationModule } from "./Modules/Authentication/authentication.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

export const imports = [
    ConfigModule.forRoot({isGlobal: true}),
    DatabaseModule,
    AuthenticationModule
];

export const controllers = [
    AppController
];

export const providers = [
    AppService
];