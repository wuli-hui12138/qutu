import { Module } from '@nestjs/common';
import { WallpapersService } from './wallpapers.service';
import { WallpapersController } from './wallpapers.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [WallpapersController],
  providers: [WallpapersService, PrismaService],
  exports: [WallpapersService],
})
export class WallpapersModule { }
