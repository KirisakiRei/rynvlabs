import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY_MS = 3000;

  async onModuleInit() {
    await this.connectWithRetry();
  }

  private async connectWithRetry(attempt = 1): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error(
        `Database connection attempt ${attempt}/${this.MAX_RETRIES} failed: ${error.message}`,
      );

      if (attempt < this.MAX_RETRIES) {
        this.logger.log(`Retrying in ${this.RETRY_DELAY_MS / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY_MS));
        return this.connectWithRetry(attempt + 1);
      }

      this.logger.error('All database connection attempts failed. Application will exit.');
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }
}
