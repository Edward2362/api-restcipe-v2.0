import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DATABASE } from "../Config/constant";

@Module({
    imports: [MongooseModule.forRoot(DATABASE)]
})
export class DatabaseModule {}