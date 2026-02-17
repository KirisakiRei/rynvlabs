import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { MulterError } from 'multer';

@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(MulterExceptionFilter.name);

  catch(exception: MulterError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;

    switch (exception.code) {
      case 'LIMIT_FILE_SIZE':
        status = HttpStatus.PAYLOAD_TOO_LARGE;
        message = 'File terlalu besar. Maksimal 10MB';
        break;
      case 'LIMIT_FILE_COUNT':
        status = HttpStatus.BAD_REQUEST;
        message = 'Terlalu banyak file';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        status = HttpStatus.BAD_REQUEST;
        message = 'Field upload tidak sesuai';
        break;
      default:
        status = HttpStatus.BAD_REQUEST;
        message = `Upload error: ${exception.message}`;
        this.logger.error(`Multer error: ${exception.code} — ${exception.message}`);
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: 'UPLOAD_ERROR',
    });
  }
}
