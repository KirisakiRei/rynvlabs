import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAcademyDto, UpdateAcademyDto } from './dto/academy.dto';
import { slugify } from '../utils/slugify';

@Injectable()
export class AcademyService {
  constructor(private prisma: PrismaService) {}

  // ========== PUBLIC ==========

  async findAll(query: {
    year?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const where: any = { isPublished: true };

    if (query.year) {
      where.year = query.year;
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
      this.prisma.academyProject.findMany({
        where,
        orderBy: [{ year: 'desc' }, { sortOrder: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.academyProject.count({ where }),
    ]);

    // Get unique years for filter
    const years = await this.prisma.academyProject.findMany({
      where: { isPublished: true },
      select: { year: true },
      distinct: ['year'],
      orderBy: { year: 'desc' },
    });

    return { data, total, page, limit, years: years.map((y) => y.year) };
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.academyProject.findUnique({
      where: { slug },
    });
    if (!project) throw new NotFoundException('Academy project not found');
    return project;
  }

  // ========== ADMIN ==========

  async findById(id: number) {
    const project = await this.prisma.academyProject.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Academy project not found');
    return project;
  }

  async findAllAdmin(query: { year?: number; search?: string }) {
    const where: any = {};

    if (query.year) where.year = query.year;

    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }

    return this.prisma.academyProject.findMany({
      where,
      orderBy: [{ year: 'desc' }, { sortOrder: 'asc' }],
    });
  }

  async create(dto: CreateAcademyDto) {
    const slug = dto.slug || slugify(dto.title);

    const maxOrder = await this.prisma.academyProject.aggregate({
      _max: { sortOrder: true },
    });

    return this.prisma.academyProject.create({
      data: {
        ...dto,
        slug,
        techStack: (dto.techStack || []) as any,
        gallery: (dto.gallery || []) as any,
        abstract: dto.abstract || '',
        methodology: dto.methodology || '',
        results: dto.results || '',
        sortOrder: dto.sortOrder ?? (maxOrder._max.sortOrder || 0) + 1,
      },
    });
  }

  async update(id: number, dto: UpdateAcademyDto) {
    const project = await this.prisma.academyProject.findUnique({
      where: { id },
    });
    if (!project) throw new NotFoundException('Academy project not found');

    const data: any = { ...dto };
    if (dto.slug) data.slug = dto.slug;
    else if (dto.title && dto.title !== project.title) {
      data.slug = slugify(dto.title);
    }

    // Preserve existing arrays if not provided
    data.techStack = dto.techStack !== undefined ? dto.techStack : project.techStack;
    data.gallery = dto.gallery !== undefined ? dto.gallery : project.gallery;

    return this.prisma.academyProject.update({ where: { id }, data });
  }

  async delete(id: number) {
    const project = await this.prisma.academyProject.findUnique({
      where: { id },
    });
    if (!project) throw new NotFoundException('Academy project not found');
    return this.prisma.academyProject.delete({ where: { id } });
  }

  async reorder(items: { id: number; sortOrder: number }[]) {
    const updates = items.map((item) =>
      this.prisma.academyProject.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      }),
    );
    await this.prisma.$transaction(updates);
    return { success: true };
  }
}
