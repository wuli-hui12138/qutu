import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
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
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createWallpaperDto: any
  ) {
    if (!file) {
      console.error('Upload failed: File is missing in request');
      throw new Error('File is missing');
    }
    console.log('--- Upload Request ---');
    console.log('File:', file.originalname, 'Size:', file.size);
    console.log('Body:', createWallpaperDto);

    const data = {
      ...createWallpaperDto,
      url: `/uploads/${file.filename}`,
      thumb: `/uploads/${file.filename}`,
    };
    return this.wallpapersService.create(data);
  }

  @Post('seed')
  seed() {
    return this.wallpapersService.seed();
  }

  @Get()
  findAll() {
    return this.wallpapersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wallpapersService.findOne(+id);
  }

  @Get('related/:tag')
  findRelated(@Param('tag') tag: string) {
    return this.wallpapersService.findRelated(tag);
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
