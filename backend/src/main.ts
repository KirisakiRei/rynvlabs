import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { PrismaExceptionFilter, PrismaValidationFilter } from './filters/prisma-exception.filter';
import { MulterExceptionFilter } from './filters/multer-exception.filter';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Enable graceful shutdown hooks
  app.enableShutdownHooks();

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Global exception filters (order matters: most specific first, catch-all last)
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new PrismaExceptionFilter(),
    new PrismaValidationFilter(),
    new MulterExceptionFilter(),
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Serve uploaded files
  const uploadDir = process.env.UPLOAD_DIR || './uploads';
  app.useStaticAssets(join(process.cwd(), uploadDir), {
    prefix: '/uploads/',
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`🚀 Backend running on http://localhost:${port}`);
}

bootstrap().catch((err) => {
  logger.error('❌ Failed to start application:', err.message);
  process.exit(1);
});

// Handle unhandled rejections and exceptions to prevent silent crashes
process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Promise Rejection:', reason?.message || reason);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error.message);
  logger.error(error.stack);
  // Give time to flush logs before exiting
  setTimeout(() => process.exit(1), 1000);
});
