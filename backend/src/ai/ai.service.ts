import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WallpapersService } from '../wallpapers/wallpapers.service';
import { SystemConfigService } from '../system-config/system-config.service';
import axios from 'axios';
import * as fs from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);

    constructor(
        private configService: ConfigService,
        private wallpapersService: WallpapersService,
        private systemConfigService: SystemConfigService,
    ) { }

    async getModels() {
        const imageModels = await this.systemConfigService.get('AI_IMAGE_MODELS');
        const chatModels = await this.systemConfigService.get('AI_CHAT_MODELS');
        return {
            imageModels: imageModels ? imageModels.split(',') : ['dall-e-3', 'flux'],
            chatModels: chatModels ? chatModels.split(',') : ['gpt-4o', 'qwen-plus']
        };
    }

    async generateImage(prompt: string, model?: string): Promise<string> {
        const dbApiKey = await this.systemConfigService.get('AI_API_KEY');
        const dbApiUrl = await this.systemConfigService.get('AI_IMAGE_URL') || await this.systemConfigService.get('AI_API_URL');
        const dbModel = await this.systemConfigService.get('AI_MODEL');

        const apiKey = dbApiKey || this.configService.get<string>('AI_API_KEY');
        const apiUrl = dbApiUrl || this.configService.get<string>('AI_API_URL') || 'https://api.openai.com/v1/images/generations';
        const finalModel = model || dbModel || this.configService.get<string>('AI_MODEL') || 'dall-e-3';

        if (!apiKey) {
            this.logger.warn('AI_API_KEY is not set. Returning a mock image.');
            return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1024/1792`;
        }

        try {
            this.logger.log(`Generating image for prompt: ${prompt} using model: ${finalModel}`);

            const isChatEndpoint = apiUrl.includes('chat/completions');
            let body: any;

            if (isChatEndpoint) {
                body = {
                    model: finalModel,
                    messages: [{ role: 'user', content: prompt }],
                    stream: false
                };
            } else {
                body = {
                    model: finalModel,
                    prompt: prompt,
                    n: 1,
                    size: '1024x1792',
                    aspect_ratio: '9:16',
                    response_format: 'url',
                };
            }

            const response = await axios.post<any>(apiUrl, body, {
                headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                timeout: 60000,
            });

            let imageUrl: string | undefined;
            if (isChatEndpoint) {
                const content = response.data?.choices?.[0]?.message?.content;
                if (content) {
                    const urlRegex = /(https?:\/\/[^\s"'<>]+)/g;
                    imageUrl = content.match(urlRegex)?.[0];
                }
            } else {
                imageUrl = response.data?.data?.[0]?.url || response.data?.images?.[0]?.url;
            }

            if (!imageUrl) {
                this.logger.error('Unexpected AI Response format:', JSON.stringify(response.data));
                throw new Error('No image URL found in response');
            }
            return imageUrl;
        } catch (error) {
            this.logger.error('AI Image Generation Failed', error.response?.data || error.message);
            throw new Error(`AI生成失败: ${error.response?.data?.error?.message || error.message}`);
        }
    }

    async generateChat(prompt: string, model: string): Promise<string> {
        const apiKey = await this.systemConfigService.get('AI_API_KEY') || this.configService.get<string>('AI_API_KEY');
        const apiUrl = await this.systemConfigService.get('AI_CHAT_URL') || 'https://api.openai.com/v1/chat/completions';

        if (!apiKey) throw new Error('AI_API_KEY is not set');

        try {
            const response = await axios.post<any>(apiUrl, {
                model: model,
                messages: [{ role: 'user', content: prompt }],
                stream: false
            }, {
                headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                timeout: 60000,
            });

            const content = response.data?.choices?.[0]?.message?.content;
            if (!content) throw new Error('No content in chat response');
            return content;
        } catch (error) {
            this.logger.error('AI Chat Failed', error.response?.data || error.message);
            throw new Error(`AI对话失败: ${error.response?.data?.error?.message || error.message}`);
        }
    }

    async saveToGallery(data: { url: string; title: string; description?: string }) {
        // 1. Download image to local uploads
        const filename = `ai-${uuidv4()}.jpg`;
        const uploadPath = join(__dirname, '..', '..', '..', 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        const filePath = join(uploadPath, filename);

        try {
            const response = await axios({
                method: 'get',
                url: data.url,
                responseType: 'stream'
            }) as any;

            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            await new Promise<void>((resolve, reject) => {
                writer.on('finish', () => resolve());
                writer.on('error', (err) => reject(err));
            });

            // 2. Call wallpapersService to create record (mimicking a normal upload)
            // Note: Creating a fake "file" object to reuse wallpapersService logic
            const mockFile = {
                path: filePath,
                filename: filename,
                destination: uploadPath,
                fieldname: 'file'
            } as any;

            // WallpapersService expects categories as a string comma separated
            // We'll assign a default 'AI生成' category if it exists, otherwise leave blank
            return this.wallpapersService.create({
                title: data.title,
                description: data.description || 'Generated by AI',
                categories: 'AI生成',
                url: `/uploads/${filename}`,
                thumb: `/uploads/${filename}`, // Initial thumb, wallpapersService usually handles this
                status: 'PENDING'
            });
        } catch (err) {
            this.logger.error('Failed to save AI image', err);
            throw err;
        }
    }
}
