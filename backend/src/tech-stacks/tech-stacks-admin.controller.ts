import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TechStacksService } from './tech-stacks.service';
import { CreateTechStackDto, UpdateTechStackDto } from './dto/tech-stack.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/tech-stacks')
@UseGuards(JwtAuthGuard)
export class TechStacksAdminController {
  constructor(private techStacksService: TechStacksService) {}

  @Get()
  findAll() {
    return this.techStacksService.findAll();
  }

  @Post()
  create(@Body() dto: CreateTechStackDto) {
    return this.techStacksService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTechStackDto,
  ) {
    return this.techStacksService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.techStacksService.delete(id);
  }
}
