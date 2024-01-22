import { HttpStatus } from '@nestjs/common';

export const createApiResponse = (
  statusCode: HttpStatus,
  response: string,
  message: string,
  payload: any = [],
) => ({
  statusCode: statusCode,
  response: response,
  message: message,
  payload: payload,
});
