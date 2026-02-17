import { Controller, Get, Param, Query } from '@nestjs/common';
import { AcademyService } from './academy.service';

@Controller('academy')
export class AcademyController {
  constructor(private academyService: AcademyService) {}

  @Get()
  findAll(
    @Query('year') year?: number,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.academyService.findAll({ year, search, page, limit });
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.academyService.findBySlug(slug);
  }
}
