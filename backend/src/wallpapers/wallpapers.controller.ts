import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { WallpapersService } from './wallpapers.service';
import { CreateWallpaperDto } from './dto/create-wallpaper.dto';
import { UpdateWallpaperDto } from './dto/update-wallpaper.dto';

@Controller('wallpapers')
export class WallpapersController {
  constructor(private readonly wallpapersService: WallpapersService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createWallpaperDto: any // Use any temporarily as Body will contain other fields
  ) {
    const data = {
      ...createWallpaperDto,
      url: `/uploads/${file.filename}`,
      thumb: `/uploads/${file.filename}`, // For now, thumb is same as url
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
