import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BannersService } from './banners.service';

@Controller('banners')
export class BannersController {
    constructor(private readonly bannersService: BannersService) { }

    @Get()
    findAll(@Query('active') active: string) {
        return this.bannersService.findAll(active === 'true');
    }

    @Post()
    create(@Body() createBannerDto: any) {
        return this.bannersService.create(createBannerDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBannerDto: any) {
        return this.bannersService.update(+id, updateBannerDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bannersService.remove(+id);
    }
}
