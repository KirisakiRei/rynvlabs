import { Module } from '@nestjs/common';
import { LandingSectionsController } from './landing-sections.controller';
import { LandingSectionsAdminController } from './landing-sections-admin.controller';
import { LandingSectionsService } from './landing-sections.service';

@Module({
  controllers: [LandingSectionsController, LandingSectionsAdminController],
  providers: [LandingSectionsService],
})
export class LandingSectionsModule {}
