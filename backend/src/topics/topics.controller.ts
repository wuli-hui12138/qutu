import { Controller, Get, Post, Body, Param, Put, Patch, Delete } from '@nestjs/common';
import { TopicsService } from './topics.service';

@Controller('topics')
export class TopicsController {
    constructor(private readonly topicsService: TopicsService) { }

    @Post()
    create(@Body() createTopicDto: any) {
        return this.topicsService.create(createTopicDto);
    }

    @Get()
    findAll() {
        return this.topicsService.findAll();
    }

    @Get('admin/all')
    findAllAdmin() {
        return this.topicsService.findAllAdmin();
    }

    @Put(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.topicsService.updateStatus(+id, status);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.topicsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTopicDto: any) {
        return this.topicsService.update(+id, updateTopicDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.topicsService.remove(+id);
    }

    @Post(':id/submit')
    submitToTopic(@Param('id') topicId: string, @Body('imageId') imageId: number) {
        return this.topicsService.submitToTopic(+topicId, imageId);
    }
}
