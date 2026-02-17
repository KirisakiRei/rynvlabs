import { IsString, IsOptional, IsBoolean, IsInt, IsArray, IsObject } from 'class-validator';

export class UpdateLandingSectionDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsObject()
  @IsOptional()
  content?: any;

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}

export class VisibilityDto {
  @IsBoolean()
  isVisible: boolean;
}

export class ReorderDto {
  @IsArray()
  items: { id: number; sortOrder: number }[];
}
