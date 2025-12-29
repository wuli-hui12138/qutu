import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { AiModelService } from './ai-model.service';

@Controller('ai-models')
export class AiModelController {
    constructor(private readonly aiModelService: AiModelService) { }

    @Get()
    async findAll() {
        return this.aiModelService.findAll();
    }

    @Post()
    async create(@Body() data: any) {
        return this.aiModelService.create(data);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() data: any) {
        return this.aiModelService.update(+id, data);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.aiModelService.delete(+id);
    }
}
