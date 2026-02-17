import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTechStackDto, UpdateTechStackDto } from './dto/tech-stack.dto';

@Injectable()
export class TechStacksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.techStack.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateTechStackDto) {
    return this.prisma.techStack.create({ data: dto });
  }

  async update(id: number, dto: UpdateTechStackDto) {
    const techStack = await this.prisma.techStack.findUnique({ where: { id } });
    if (!techStack) throw new NotFoundException('Tech stack not found');
    return this.prisma.techStack.update({ where: { id }, data: dto });
  }

  async delete(id: number) {
    const techStack = await this.prisma.techStack.findUnique({ where: { id } });
    if (!techStack) throw new NotFoundException('Tech stack not found');
    return this.prisma.techStack.delete({ where: { id } });
  }
}
