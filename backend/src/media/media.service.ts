import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(private prisma: PrismaService) {}

  async create(file: Express.Multer.File) {
    const media = await this.prisma.media.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: `/uploads/${file.filename}`,
      },
    });

    return media;
  }

  async createMultiple(files: Express.Multer.File[]) {
    const mediaRecords = await Promise.all(
      files.map((file) =>
        this.prisma.media.create({
          data: {
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: `/uploads/${file.filename}`,
          },
        }),
      ),
    );

    return mediaRecords;
  }

  async findAll(query: { page?: number; limit?: number; type?: string }) {
    const where: any = {};

    if (query.type === 'image') {
      where.mimeType = { startsWith: 'image/' };
    } else if (query.type === 'document') {
      where.mimeType = { not: { startsWith: 'image/' } };
    }

    const page = query.page || 1;
    const limit = query.limit || 50;

    const [data, total] = await Promise.all([
      this.prisma.media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.media.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async delete(id: number) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundException('Media not found');

    // Delete file from disk (non-blocking — don't fail the request if file is missing)
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const filePath = join(process.cwd(), uploadDir, media.filename);
    try {
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    } catch (err) {
      this.logger.warn(`Failed to delete file ${filePath}: ${err.message}`);
      // Continue with DB record deletion even if file delete fails
    }

    return this.prisma.media.delete({ where: { id } });
  }
}
