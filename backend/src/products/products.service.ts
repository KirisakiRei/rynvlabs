import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { slugify } from '../utils/slugify';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // ========== PUBLIC ==========

  async findAll() {
    return this.prisma.product.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({ where: { slug } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // ========== ADMIN ==========

  async findById(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findAllAdmin() {
    return this.prisma.product.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(dto: CreateProductDto) {
    const slug = dto.slug || slugify(dto.title);

    const maxOrder = await this.prisma.product.aggregate({
      _max: { sortOrder: true },
    });

    return this.prisma.product.create({
      data: {
        ...dto,
        slug,
        features: (dto.features || []) as any,
        stats: (dto.stats || []) as any,
        specs: dto.specs || '',
        background: dto.background || '',
        solution: dto.solution || '',
        sortOrder: dto.sortOrder ?? (maxOrder._max.sortOrder || 0) + 1,
      },
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    const data: any = { ...dto };
    if (dto.slug) data.slug = dto.slug;
    else if (dto.title && dto.title !== product.title) {
      data.slug = slugify(dto.title);
    }

    // Preserve existing arrays if not provided; ensure arrays are never undefined
    data.features = dto.features !== undefined ? dto.features : product.features;
    data.stats = dto.stats !== undefined ? dto.stats : product.stats;

    return this.prisma.product.update({ where: { id }, data });
  }

  async delete(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return this.prisma.product.delete({ where: { id } });
  }

  async reorder(items: { id: number; sortOrder: number }[]) {
    const updates = items.map((item) =>
      this.prisma.product.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      }),
    );
    await this.prisma.$transaction(updates);
    return { success: true };
  }
}
