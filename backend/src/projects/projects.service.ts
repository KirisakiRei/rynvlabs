import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { slugify } from '../utils/slugify';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  // ========== PUBLIC ==========

  async findAll(query: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const where: any = { isPublished: true };

    if (query.category) {
      where.category = query.category.toUpperCase();
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }

    const page = query.page || 1;
    const limit = query.limit || 50;

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        orderBy: { sortOrder: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.project.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({ where: { slug } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  // ========== ADMIN ==========

  async findById(id: number) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async findAllAdmin(query: { category?: string; search?: string }) {
    const where: any = {};

    if (query.category) {
      where.category = query.category.toUpperCase();
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }

    return this.prisma.project.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(dto: CreateProjectDto) {
    const slug = dto.slug || slugify(dto.title);

    const maxOrder = await this.prisma.project.aggregate({
      _max: { sortOrder: true },
    });

    return this.prisma.project.create({
      data: {
        ...dto,
        slug,
        techStack: (dto.techStack || []) as any,
        gallery: (dto.gallery || []) as any,
        stats: (dto.stats || []) as any,
        challenge: dto.challenge || '',
        solution: dto.solution || '',
        deepDive: dto.deepDive || '',
        sortOrder: dto.sortOrder ?? (maxOrder._max.sortOrder || 0) + 1,
      },
    });
  }

  async update(id: number, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');

    const data: any = { ...dto };
    if (dto.slug) data.slug = dto.slug;
    else if (dto.title && dto.title !== project.title) {
      data.slug = slugify(dto.title);
    }

    // Preserve existing arrays if not provided; ensure arrays are never undefined
    data.techStack = dto.techStack !== undefined ? dto.techStack : project.techStack;
    data.gallery = dto.gallery !== undefined ? dto.gallery : project.gallery;
    data.stats = dto.stats !== undefined ? dto.stats : project.stats;

    return this.prisma.project.update({ where: { id }, data });
  }

  async delete(id: number) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return this.prisma.project.delete({ where: { id } });
  }

  async reorder(items: { id: number; sortOrder: number }[]) {
    const updates = items.map((item) =>
      this.prisma.project.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      }),
    );
    await this.prisma.$transaction(updates);
    return { success: true };
  }
}
