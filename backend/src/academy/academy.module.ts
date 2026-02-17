import { Module } from '@nestjs/common';
import { AcademyController } from './academy.controller';
import { AcademyAdminController } from './academy-admin.controller';
import { AcademyService } from './academy.service';

@Module({
  controllers: [AcademyController, AcademyAdminController],
  providers: [AcademyService],
})
export class AcademyModule {}
