import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Customer {
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