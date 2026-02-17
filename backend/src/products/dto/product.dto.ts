import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class FeatureDto {
  @IsString()
  icon: string;

  @IsString()
  title: string;

  @IsString()
  desc: string;
}

export class StatDto {
  @IsString()
  label: string;

  @IsString()
  value: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureDto)
  @IsOptional()
  features?: FeatureDto[];

  @IsString()
  @IsOptional()
  specs?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatDto)
  @IsOptional()
  stats?: StatDto[];

  @IsString()
  @IsOptional()
  background?: string;

  @IsString()
  @IsOptional()
  solution?: string;

  @IsInt()
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class ReorderDto {
  @IsArray()
  items: { id: number; sortOrder: number }[];
}
