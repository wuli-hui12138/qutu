import { Injectable } from '@nestjs/common';
import { CreateWallpaperDto } from './dto/create-wallpaper.dto';
import { UpdateWallpaperDto } from './dto/update-wallpaper.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WallpapersService {
  constructor(private prisma: PrismaService) { }

  create(data: any) {
    return this.prisma.image.create({ data });
  }

  findAll() {
    return this.prisma.image.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  findOne(id: number) {
    return this.prisma.image.findUnique({ where: { id } });
  }

  async findRelated(tag: string) {
    return this.prisma.image.findMany({
      where: {
        tags: {
          contains: tag
        }
      },
      take: 6,
      orderBy: {
        views: 'desc'
      }
    });
  }

  update(id: number, updateWallpaperDto: UpdateWallpaperDto) {
    // @ts-ignore
    return this.prisma.image.update({
      where: { id },
      data: updateWallpaperDto,
    });
  }

  remove(id: number) {
    return this.prisma.image.delete({ where: { id } });
  }

  async seed() {
    const count = await this.prisma.image.count();
    if (count > 0) return { message: 'Already seeded' };

    const initialData = [
      {
        url: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        thumb: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        title: "Neon City",
        category: "Phone",
        tags: "4K,City"
      },
      {
        url: "https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        thumb: "https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        title: "Portrait",
        category: "Avatar",
        tags: "Girl,Portrait"
      },
      {
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        thumb: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        title: "Beauty",
        category: "Avatar",
        tags: "Beauty,Smile"
      },
      {
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        thumb: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        title: "Red",
        category: "Avatar",
        tags: "Red,Portrait"
      },
      {
        url: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        thumb: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        title: "Abstract",
        category: "Phone",
        tags: "Abstract,Gradient"
      },
      {
        url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        thumb: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        title: "Neon Bottle",
        category: "Phone",
        tags: "Neon,Light"
      }
    ];

    for (const img of initialData) {
      await this.prisma.image.create({ data: img });
    }
    return { message: `Seeded ${initialData.length} images` };
  }
}
