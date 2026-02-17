import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message || exception.message;
      // For arrays of messages (validation), join them
      if (Array.isArray(message)) {
        message = message.join('; ');
      }
    } else if (exception instanceof Error) {
      // Handle generic errors (e.g. from multer fileFilter)
      if (exception.message === 'Invalid file type') {
        status = HttpStatus.BAD_REQUEST;
        message = 'Tipe file tidak didukung. Gunakan: JPEG, PNG, GIF, WebP, SVG, atau PDF';
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Terjadi kesalahan pada server';
        this.logger.error(
          `Unhandled error on ${request.method} ${request.url}: ${exception.message}`,
          exception.stack,
        );
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Terjadi kesalahan yang tidak diketahui';
      this.logger.error(`Unknown error on ${request.method} ${request.url}:`, exception);
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
