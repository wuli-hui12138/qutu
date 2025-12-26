import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('models')
    async getModels() {
        return this.aiService.getModels();
    }

    @Post('generate')
    async generate(@Body() body: { prompt: string; model?: string }) {
        return this.aiService.generateImage(body.prompt, body.model);
    }

    @Post('tasks')
    async getTasks(@Body() body: { limit?: number }) {
        return this.aiService.getTasks(body.limit);
    }

    @Post('task-status')
    async getTaskStatus(@Body() body: { id: number }) {
        return this.aiService.getTaskStatus(body.id);
    }

    @Post('chat')
    async chat(@Body() body: { prompt: string; model: string }) {
        const content = await this.aiService.generateChat(body.prompt, body.model);
        return { content };
    }

    @Post('save')
    async save(@Body() data: { url: string; title: string; description?: string }) {
        return this.aiService.saveToGallery(data);
    }
}
