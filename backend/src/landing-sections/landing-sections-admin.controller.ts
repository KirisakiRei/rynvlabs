import {
  Controller,
  Get,
  Put,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { LandingSectionsService } from './landing-sections.service';
import {
  UpdateLandingSectionDto,
  VisibilityDto,
  ReorderDto,
} from './dto/landing-section.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/landing-sections')
@UseGuards(JwtAuthGuard)
export class LandingSectionsAdminController {
  constructor(private landingSectionsService: LandingSectionsService) {}

  @Get()
  findAll() {
    return this.landingSectionsService.findAll();
  }

  @Get(':sectionKey')
  findByKey(@Param('sectionKey') sectionKey: string) {
    return this.landingSectionsService.findByKey(sectionKey);
  }

  @Put(':sectionKey')
  update(
    @Param('sectionKey') sectionKey: string,
    @Body() dto: UpdateLandingSectionDto,
  ) {
    return this.landingSectionsService.update(sectionKey, dto);
  }

  @Patch(':sectionKey/visibility')
  toggleVisibility(
    @Param('sectionKey') sectionKey: string,
    @Body() dto: VisibilityDto,
  ) {
    return this.landingSectionsService.toggleVisibility(
      sectionKey,
      dto.isVisible,
    );
  }

  @Patch('reorder')
  reorder(@Body() dto: ReorderDto) {
    return this.landingSectionsService.reorder(dto.items);
  }
}
