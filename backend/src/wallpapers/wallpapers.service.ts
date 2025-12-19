import { Injectable } from '@nestjs/common';
import { CreateWallpaperDto } from './dto/create-wallpaper.dto';
import { UpdateWallpaperDto } from './dto/update-wallpaper.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WallpapersService {
  constructor(private prisma: PrismaService) { }

  async create(data: any) {
    const { category, tags, ...rest } = data;

    // Process tags (comma separated string -> connectOrCreate)
    const tagArray = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    const tagConnections = tagArray.map(name => ({
      where: { name },
      create: { name }
    }));

    // Process category (string name -> connect by name)
    const categoryConnect = category ? {
      connectOrCreate: {
        where: { name: category },
        create: { name: category }
      }
    } : undefined;

    return this.prisma.image.create({
      data: {
        ...rest,
        category: categoryConnect,
        tags: {
          connectOrCreate: tagConnections
        }
      },
      include: {
        category: true,
        tags: true
      }
    });
  }

  // User facing: only approved
  findAll(query?: any) {
    const where: any = { status: 'APPROVED' };

    if (query?.category) {
      where.category = { name: query.category };
    }

    if (query?.tag) {
      where.tags = { some: { name: query.tag } };
    }

    if (query?.search) {
      where.title = { contains: query.search };
    }

    return this.prisma.image.findMany({
      where,
      include: {
        category: true,
        tags: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Admin facing: all statuses
  findAllAdmin(query?: string) {
    const where: any = {};
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { description: { contains: query } }
      ];
    }
    return this.prisma.image.findMany({
      where,
      include: {
        category: true,
        tags: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  findOne(id: number) {
    return this.prisma.image.findUnique({
      where: { id },
      include: {
        category: true,
        tags: true
      }
    });
  }

  async findRelated(tagName: string) {
    return this.prisma.image.findMany({
      where: {
        status: 'APPROVED',
        tags: {
          some: {
            name: tagName
          }
        }
      },
      include: {
        category: true,
        tags: true
      },
      take: 6,
      orderBy: {
        views: 'desc'
      }
    });
  }

  update(id: number, updateWallpaperDto: UpdateWallpaperDto) {
    return this.prisma.image.update({
      where: { id },
      data: updateWallpaperDto as any,
    });
  }

  updateStatus(id: number, status: string) {
    return this.prisma.image.update({
      where: { id },
      data: { status }
    });
  }

  async remove(id: number) {
    const image = await this.prisma.image.findUnique({ where: { id } });
    if (image) {
      // Try to delete files
      const fs = require('fs');
      const path = require('path');
      const root = path.join(__dirname, '..', '..', 'uploads');

      try {
        const filesToDelete = [
          path.join(root, path.basename(image.url)),
          path.join(root, path.basename(image.thumb))
        ];
        filesToDelete.forEach(p => {
          if (fs.existsSync(p)) fs.unlinkSync(p);
        });
      } catch (e) {
        console.error('Failed to delete files:', e);
      }
    }
    return this.prisma.image.delete({ where: { id } });
  }

  async seed() {
    // Categories and Tags seeding...
    const categories = ['手机壁纸', '电脑壁纸', '个性头像', '动态图', '极致简约', '暗黑系'];
    for (const name of categories) {
      await this.prisma.category.upsert({
        where: { name },
        update: {},
        create: { name }
      });
    }

    const tags = ['4K', '赛博朋克', '森系', '极简', '二次元', '治愈系', '美学', 'City', 'Girl', 'Portrait', 'Abstract', 'Neon'];
    for (const name of tags) {
      await this.prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name }
      });
    }

    // Update existing images to APPROVED if any
    await this.prisma.image.updateMany({
      where: { status: 'PENDING' },
      data: { status: 'APPROVED' }
    });

    return { message: `Seeded categories, tags, and approved existing images` };
  }
}
