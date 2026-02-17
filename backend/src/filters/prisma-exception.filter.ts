import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;

    switch (exception.code) {
      // Unique constraint violation
      case 'P2002': {
        status = HttpStatus.CONFLICT;
        const fields = (exception.meta?.target as string[])?.join(', ') || 'field';
        message = `Data dengan ${fields} tersebut sudah ada`;
        break;
      }

      // Record not found
      case 'P2025': {
        status = HttpStatus.NOT_FOUND;
        message = 'Data tidak ditemukan';
        break;
      }

      // Foreign key constraint violation
      case 'P2003': {
        status = HttpStatus.BAD_REQUEST;
        const field = (exception.meta?.field_name as string) || 'field';
        message = `Tidak dapat menghapus/mengubah data karena masih digunakan oleh data lain (${field})`;
        break;
      }

      // Required field missing
      case 'P2011': {
        status = HttpStatus.BAD_REQUEST;
        message = 'Field yang wajib diisi tidak boleh kosong';
        break;
      }

      // Value too long
      case 'P2000': {
        status = HttpStatus.BAD_REQUEST;
        message = 'Nilai yang dimasukkan terlalu panjang';
        break;
      }

      default: {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Terjadi kesalahan pada database';
        this.logger.error(
          `Unhandled Prisma error: ${exception.code} — ${exception.message}`,
          exception.stack,
        );
      }
    }

    this.logger.warn(`Prisma error ${exception.code}: ${message}`);

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.code,
    });
  }
}

@Catch(Prisma.PrismaClientValidationError)
export class PrismaValidationFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaValidationFilter.name);

  catch(exception: Prisma.PrismaClientValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.warn(`Prisma validation error: ${exception.message}`);

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Data yang dikirim tidak valid',
      error: 'VALIDATION_ERROR',
    });
  }
}
