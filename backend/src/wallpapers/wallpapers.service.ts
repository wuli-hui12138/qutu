import { Injectable } from '@nestjs/common';
import { CreateWallpaperDto } from './dto/create-wallpaper.dto';
import { UpdateWallpaperDto } from './dto/update-wallpaper.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WallpapersService {
  constructor(private prisma: PrismaService) { }

  async create(data: any) {
    const { category, tags, collections, ...rest } = data;

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

  findAll() {
    return this.prisma.image.findMany({
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
    // Basic update - for complex relation updates, this needs more logic
    return this.prisma.image.update({
      where: { id },
      data: updateWallpaperDto as any,
    });
  }

  remove(id: number) {
    return this.prisma.image.delete({ where: { id } });
  }

  async seed() {
    // 1. Seed Categories
    const categories = ['手机壁纸', '电脑壁纸', '个性头像', '动态图', '极致简约', '暗黑系'];
    for (const name of categories) {
      await this.prisma.category.upsert({
        where: { name },
        update: {},
        create: { name }
      });
    }

    // 2. Seed Tags
    const tags = ['4K', '赛博朋克', '森系', '极简', '二次元', '治愈系', '美学', 'City', 'Girl', 'Portrait', 'Abstract', 'Neon'];
    for (const name of tags) {
      await this.prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name }
      });
    }

    // 3. Seed Collections (Topics)
    const collections = [
      { name: '赛博霓虹', description: '跨越未来的霓虹美学', cover: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400' },
      { name: '极致极简', description: '生活减法，视觉加法', cover: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=400' }
    ];
    for (const coll of collections) {
      await this.prisma.collection.upsert({
        where: { name: coll.name },
        update: {},
        create: coll
      });
    }

    // 4. Seed Images
    const initialImages = [
      {
        url: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800",
        thumb: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400",
        title: "Neon City",
        category: "手机壁纸",
        tags: "4K,City,Neon"
      },
      {
        url: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=800",
        thumb: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=400",
        title: "Portrait",
        category: "个性头像",
        tags: "Girl,Portrait"
      },
      {
        url: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=800",
        thumb: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=400",
        title: "Abstract Gradient",
        category: "手机壁纸",
        tags: "Abstract,4K"
      }
    ];

    for (const img of initialImages) {
      const { category, tags, ...rest } = img;
      await this.prisma.image.create({
        data: {
          ...rest,
          category: { connect: { name: category } },
          tags: {
            connect: tags.split(',').map(name => ({ name }))
          }
        }
      });
    }

    return { message: `Seeded images, categories, tags, and collections` };
  }
}
