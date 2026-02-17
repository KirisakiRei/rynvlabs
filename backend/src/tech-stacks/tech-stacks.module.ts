import { Module } from '@nestjs/common';
import { TechStacksController } from './tech-stacks.controller';
import { TechStacksAdminController } from './tech-stacks-admin.controller';
import { TechStacksService } from './tech-stacks.service';

@Module({
  controllers: [TechStacksController, TechStacksAdminController],
  providers: [TechStacksService],
})
export class TechStacksModule {}
