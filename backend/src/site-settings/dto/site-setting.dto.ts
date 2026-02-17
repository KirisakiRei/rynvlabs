import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSiteSettingDto {
  @IsNotEmpty()
  value: any;
}
