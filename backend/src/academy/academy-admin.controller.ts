import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AcademyService } from './academy.service';
import { CreateAcademyDto, UpdateAcademyDto, ReorderDto } from './dto/academy.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/academy')
@UseGuards(JwtAuthGuard)
export class AcademyAdminController {
  constructor(private academyService: AcademyService) {}

  @Get()
  findAll(
    @Query('year') year?: number,
    @Query('search') search?: string,
  ) {
    return this.academyService.findAllAdmin({ year, search });
  }

  @Patch('reorder')
  reorder(@Body() dto: ReorderDto) {
    return this.academyService.reorder(dto.items);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.academyService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateAcademyDto) {
    return this.academyService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAcademyDto,
  ) {
    return this.academyService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.academyService.delete(id);
  }
}
