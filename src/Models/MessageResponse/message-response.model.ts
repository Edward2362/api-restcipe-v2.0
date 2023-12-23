export class MessageResponse<T> {
    statusCode: number;
    data: T;
    message: string;
}