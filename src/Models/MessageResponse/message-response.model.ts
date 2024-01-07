import { ApiProperty } from "@nestjs/swagger";

export class MessageResponse<T> {
    @ApiProperty()
    statusCode: number;
    data: T;
    @ApiProperty()
    message: string;
}