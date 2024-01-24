import { HttpStatus } from '@nestjs/common';
export declare const createApiResponse: (statusCode: HttpStatus, response: string, message: string, payload?: any) => {
    statusCode: HttpStatus;
    response: string;
    message: string;
    payload: any;
};
