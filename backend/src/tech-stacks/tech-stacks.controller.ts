import { Controller, Get } from '@nestjs/common';
import { TechStacksService } from './tech-stacks.service';

@Controller('tech-stacks')
export class TechStacksController {
  constructor(private techStacksService: TechStacksService) {}

  @Get()
  findAll() {
    return this.techStacksService.findAll();
  }
}
