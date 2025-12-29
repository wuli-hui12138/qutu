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
    async generate(@Body() body: { prompt: string; model?: string; userId?: number; aspect_ratio?: string }) {
        return this.aiService.generateImage(body.prompt, body.userId, body.model, body.aspect_ratio);
    }

    @Post('tasks')
    async getTasks(@Body() body: { limit?: number; userId?: number }) {
        return this.aiService.getTasks(body.userId, body.limit);
    }

    @Post('chat-history')
    async getChatHistory(@Body() body: { userId: number; model?: string; limit?: number }) {
        return this.aiService.getChatHistory(body.userId, body.model, body.limit);
    }

    @Post('save-chat')
    async saveChat(@Body() body: { userId: number; model: string; messages: any[] }) {
        return this.aiService.saveChatHistory(body.userId, body.model, body.messages);
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
