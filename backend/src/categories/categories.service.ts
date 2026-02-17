import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { slugify } from '../utils/slugify';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(type?: string) {
    const where: any = {};
    if (type) where.type = type.toUpperCase();

    return this.prisma.category.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug || slugify(dto.name);
    const maxOrder = await this.prisma.category.aggregate({
      _max: { sortOrder: true },
    });

    return this.prisma.category.create({
      data: {
        ...dto,
        slug,
        sortOrder: dto.sortOrder ?? (maxOrder._max.sortOrder || 0) + 1,
      },
    });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    const data: any = { ...dto };
    if (dto.slug) data.slug = dto.slug;
    else if (dto.name && dto.name !== category.name) {
      data.slug = slugify(dto.name);
    }

    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return this.prisma.category.delete({ where: { id } });
  }

  async reorder(items: { id: number; sortOrder: number }[]) {
    const updates = items.map((item) =>
      this.prisma.category.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      }),
    );
    await this.prisma.$transaction(updates);
    return { success: true };
  }
}
