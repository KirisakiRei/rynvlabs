import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateLandingSectionDto } from './dto/landing-section.dto';

@Injectable()
export class LandingSectionsService {
  constructor(private prisma: PrismaService) {}

  // ========== PUBLIC ==========

  async findAllPublic() {
    return this.prisma.landingSection.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  // ========== ADMIN ==========

  async findAll() {
    return this.prisma.landingSection.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findByKey(sectionKey: string) {
    const section = await this.prisma.landingSection.findUnique({
      where: { sectionKey },
    });
    if (!section) throw new NotFoundException('Landing section not found');
    return section;
  }

  async update(sectionKey: string, dto: UpdateLandingSectionDto) {
    const section = await this.prisma.landingSection.findUnique({
      where: { sectionKey },
    });
    if (!section) throw new NotFoundException('Landing section not found');

    return this.prisma.landingSection.update({
      where: { sectionKey },
      data: dto,
    });
  }

  async toggleVisibility(sectionKey: string, isVisible: boolean) {
    const section = await this.prisma.landingSection.findUnique({
      where: { sectionKey },
    });
    if (!section) throw new NotFoundException('Landing section not found');

    return this.prisma.landingSection.update({
      where: { sectionKey },
      data: { isVisible },
    });
  }

  async reorder(items: { id: number; sortOrder: number }[]) {
    const updates = items.map((item) =>
      this.prisma.landingSection.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      }),
    );
    await this.prisma.$transaction(updates);
    return { success: true };
  }
}
