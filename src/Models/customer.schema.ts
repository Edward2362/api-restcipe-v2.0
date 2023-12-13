import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Customer {
    @Prop()
    _id: Types.ObjectId;

    @Prop()
    customerEmail: string;

    @Prop()
    customerPassword: string;

    @Prop()
    customerFirstName: string;

    @Prop()
    customerLastName: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);