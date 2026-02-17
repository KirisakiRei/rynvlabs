import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SiteSettingsService } from './site-settings.service';
import { UpdateSiteSettingDto } from './dto/site-setting.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/site-settings')
@UseGuards(JwtAuthGuard)
export class SiteSettingsAdminController {
  constructor(private siteSettingsService: SiteSettingsService) {}

  @Get()
  findAll() {
    return this.siteSettingsService.findAllRaw();
  }

  @Get(':key')
  findByKey(@Param('key') key: string) {
    return this.siteSettingsService.findByKey(key);
  }

  @Put(':key')
  update(@Param('key') key: string, @Body() dto: UpdateSiteSettingDto) {
    return this.siteSettingsService.update(key, dto.value);
  }
}
