import { Request, Response } from 'express';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { isObject } from 'src/common/utils/is-object';

interface ErrorResponse {
  code: string;
  message: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    let errorResponse: ErrorResponse = {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      // case: string response
      if (typeof exceptionResponse === 'string') {
        errorResponse = {
          code: exceptionResponse,
          message: exceptionResponse,
        };
      }

      // case: object response
      if (isObject(exceptionResponse)) {
        const code =
          typeof exceptionResponse.error === 'string'
            ? exceptionResponse.error
            : 'HTTP_EXCEPTION';

        const message =
          typeof exceptionResponse.message === 'string'
            ? exceptionResponse.message
            : 'Request failed';

        errorResponse = { code, message };
      }
    }

    response.status(status).json({
      success: false,
      error: errorResponse,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
