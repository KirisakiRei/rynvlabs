import { Controller, Get } from '@nestjs/common';
import { LandingSectionsService } from './landing-sections.service';

@Controller('landing-sections')
export class LandingSectionsController {
  constructor(private landingSectionsService: LandingSectionsService) {}

  @Get()
  findAll() {
    return this.landingSectionsService.findAllPublic();
  }
}
