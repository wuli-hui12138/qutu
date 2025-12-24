import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('generate')
    async generate(@Body('prompt') prompt: string) {
        const url = await this.aiService.generateImage(prompt);
        return { url };
    }

    @Post('save')
    async save(@Body() data: { url: string; title: string; description?: string }) {
        return this.aiService.saveToGallery(data);
    }
}
