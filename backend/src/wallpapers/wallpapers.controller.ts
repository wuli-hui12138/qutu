import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import sharp from 'sharp';
import { WallpapersService } from './wallpapers.service';
import { CreateWallpaperDto } from './dto/create-wallpaper.dto';
import { UpdateWallpaperDto } from './dto/update-wallpaper.dto';

@Controller('wallpapers')
export class WallpapersController {
  constructor(private readonly wallpapersService: WallpapersService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = join(__dirname, '..', '..', 'uploads');
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createWallpaperDto: any
  ) {
    if (!file) {
      console.error('Upload failed: File is missing in request');
      throw new Error('File is missing');
    }

    const originalPath = file.path;
    const thumbFilename = `thumb-${file.filename}`;
    const thumbPath = join(file.destination, thumbFilename);

    console.log('--- Processing Thumbnail ---');
    try {
      await sharp(originalPath)
        .resize(400) // Fit to width 400px, keeping aspect ratio
        .webp({ quality: 80 }) // Convert to webp for better compression
        .toFile(thumbPath);
      console.log('Thumbnail created:', thumbFilename);
    } catch (err) {
      console.error('Thumbnail Generation Error:', err);
      // Fallback to original if thumbnail fails
    }

    const data = {
      ...createWallpaperDto,
      url: `/uploads/${file.filename}`,
      thumb: fs.existsSync(thumbPath) ? `/uploads/${thumbFilename}` : `/uploads/${file.filename}`,
    };

    try {
      const result = await this.wallpapersService.create(data);
      return result;
    } catch (err) {
      console.error('Database Save Error:', err);
      throw err;
    }
  }

  @Post('seed')
  seed() {
    return this.wallpapersService.seed();
  }

  @Get('admin')
  findAllAdmin(@Query('search') search: string) {
    return this.wallpapersService.findAllAdmin(search);
  }

  @Get()
  findAll(
    @Query('categories') categories: string,
    @Query('tags') tags: string,
    @Query('search') search: string,
    @Query('ids') ids: string,
  ) {
    return this.wallpapersService.findAll({ categories, tags, search, ids });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wallpapersService.findOne(+id);
  }

  @Get('related/:tag')
  findRelated(@Param('tag') tag: string) {
    return this.wallpapersService.findRelated(tag);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.wallpapersService.updateStatus(+id, status);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWallpaperDto: UpdateWallpaperDto) {
    return this.wallpapersService.update(+id, updateWallpaperDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wallpapersService.remove(+id);
  }
}
