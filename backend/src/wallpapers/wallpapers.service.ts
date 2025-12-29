import { Injectable } from '@nestjs/common';
import { CreateWallpaperDto } from './dto/create-wallpaper.dto';
import { UpdateWallpaperDto } from './dto/update-wallpaper.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WallpapersService {
  constructor(private prisma: PrismaService) { }

  async create(data: any) {
    const { categories, tags, topicId, blurData, authorId, ...rest } = data;

    // Process tags (comma separated string -> connectOrCreate)
    const tagArray = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean)) : [];
    const tagConnections = tagArray.map(name => ({
      where: { name },
      create: { name }
    }));

    // Process categories (comma separated string -> connectOrCreate)
    const catArray = categories ? (Array.isArray(categories) ? categories : categories.split(',').map(c => c.trim()).filter(Boolean)) : [];
    const catConnections = catArray.map(name => ({
      where: { name },
      create: { name }
    }));

    // Process topicId
    const topicIdInt = topicId ? parseInt(topicId) : undefined;

    return this.prisma.image.create({
      data: {
        ...rest,
        blurData,
        authorId: authorId ? parseInt(authorId) : undefined,
        topicId: (topicIdInt && !isNaN(topicIdInt)) ? topicIdInt : undefined,
        categories: {
          connectOrCreate: catConnections
        },
        tags: {
          connectOrCreate: tagConnections
        }
      },
      include: {
        categories: true,
        tags: true,
        topic: true
      }
    });
  }

  // User facing: only approved and visible
  findAll(query?: any) {
    const where: any = {
      status: 'APPROVED',
      isVisible: true
    };

    // AND logic for multiple categories
    if (query?.categories) {
      const catArray = Array.isArray(query.categories)
        ? query.categories
        : query.categories.split(',').map(c => c.trim()).filter(Boolean);

      if (catArray.length > 0) {
        where.categories = {
          some: {
            name: { in: catArray }
          }
        };
      }
    }

    // AND logic for multiple tags
    if (query?.tags) {
      const tagArray = Array.isArray(query.tags)
        ? query.tags
        : query.tags.split(',').map(t => t.trim()).filter(Boolean);

      if (tagArray.length > 0) {
        where.tags = {
          some: {
            name: { in: tagArray }
          }
        };
      }
    }

    if (query?.search) {
      where.title = { contains: query.search };
    }

    if (query?.ids) {
      const idArray = query.ids.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      if (idArray.length > 0) {
        where.id = { in: idArray };
      }
    }

    if (query?.isBanner === 'true') {
      where.isBanner = true;
    }

    const limit = query?.limit ? parseInt(query.limit) : undefined;

    return this.prisma.image.findMany({
      where,
      include: {
        categories: true,
        tags: true,
        topic: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit && !isNaN(limit) ? limit : undefined
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
        categories: true,
        tags: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  findOne(id: number) {
    return this.prisma.image.findUnique({
      where: { id },
      include: {
        categories: true,
        tags: true,
        topic: true,
        author: true
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
        categories: true,
        tags: true
      },
      take: 6,
      orderBy: {
        views: 'desc'
      }
    });
  }

  async update(id: number, data: any) {
    const { categories, tags, ...rest } = data;

    const tagArray = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean)) : undefined;
    const catArray = categories ? (Array.isArray(categories) ? categories : categories.split(',').map(c => c.trim()).filter(Boolean)) : undefined;

    // Check Banner Limit (Max 8)
    if (data.isBanner === true) {
      const bannerCount = await this.prisma.image.count({
        where: { isBanner: true, id: { not: id } }
      });
      if (bannerCount >= 8) {
        throw new Error('Banner 数量已达上限 (最多 8 个)');
      }
    }

    return this.prisma.image.update({
      where: { id },
      data: {
        ...rest,
        isBanner: data.isBanner,
        isVisible: data.isVisible,
        // Categories update: set (disconnect all old, connect new)
        categories: catArray ? {
          set: [],
          connectOrCreate: catArray.map(name => ({
            where: { name },
            create: { name }
          }))
        } : undefined,
        // Tags update: set (disconnect all old, connect new)
        tags: tagArray ? {
          set: [],
          connectOrCreate: tagArray.map(name => ({
            where: { name },
            create: { name }
          }))
        } : undefined,
      },
      include: {
        categories: true,
        tags: true
      }
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
    // Seed categories...
    const initialCategories = ['手机壁纸', '电脑壁纸', '个性头像', '动态图', '极致简约', '暗黑系'];
    for (const name of initialCategories) {
      await this.prisma.category.upsert({
        where: { name },
        update: {},
        create: { name }
      });
    }

    const initialTags = ['4K', '赛博朋克', '森系', '极简', '二次元', '治愈系', '美学', 'City', 'Girl', 'Portrait', 'Abstract', 'Neon'];
    for (const name of initialTags) {
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
