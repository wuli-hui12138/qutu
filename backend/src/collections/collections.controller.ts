import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CollectionsService } from './collections.service';

@Controller('collections')
export class CollectionsController {
    constructor(private readonly collectionsService: CollectionsService) { }

    @Get()
    findAll() {
        return this.collectionsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.collectionsService.findOne(+id);
    }

    @Post()
    create(@Body() data: any) {
        return this.collectionsService.create(data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.collectionsService.remove(+id);
    }
}
