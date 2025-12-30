import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../interfaces/error-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let details: Record<string, string> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: any = exception.getResponse();

      if (Array.isArray(res?.message)) {
        message = 'Datos de entrada inválidos';
        details = this.extractValidationErrors(res.message);
      } else {
        message = res?.message || exception.message;
      }
    }

    const errorResponse: ErrorResponse = {
      timestamp: new Date().toISOString(),
      status,
      error: HttpStatus[status],
      message,
      path: request.url,
      ...(details && { details }),
    };

    response.status(status).json(errorResponse);
  }

  private extractValidationErrors(messages: any[]): Record<string, string> {
    const errors: Record<string, string> = {};

    messages.forEach((msg) => {
      if (typeof msg === 'object' && msg.property && msg.constraints) {
        errors[msg.property] = Object.values(msg.constraints)[0] as string;
      }
    });

    return errors;
  }
}
