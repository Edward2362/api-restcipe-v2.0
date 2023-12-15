export class MessageResponseList<T> {
    statusCode: number;
    data: T[];
    message: string;
}