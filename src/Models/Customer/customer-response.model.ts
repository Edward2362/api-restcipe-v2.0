import { ApiProperty } from "@nestjs/swagger";

export class CustomerResponse {
    @ApiProperty()
    customerEmail: string;
    @ApiProperty()
    customerFirstName: string;
    @ApiProperty()
    customerLastName: string;
    @ApiProperty()
    token: string;
}