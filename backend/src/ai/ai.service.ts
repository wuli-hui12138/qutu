import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WallpapersService } from '../wallpapers/wallpapers.service';
import { SystemConfigService } from '../system-config/system-config.service';
import { PrismaService } from '../prisma.service';
import axios from 'axios';
import * as fs from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as _sharp from 'sharp';
const sharp = _sharp as any;

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);

    constructor(
        private configService: ConfigService,
        private wallpapersService: WallpapersService,
        private systemConfigService: SystemConfigService,
        private prisma: PrismaService,
    ) { }

    async getModels() {
        const imageModels = await this.systemConfigService.get('AI_IMAGE_MODELS');
        const chatModels = await this.systemConfigService.get('AI_CHAT_MODELS');
        return {
            imageModels: imageModels ? imageModels.split(',') : ['dall-e-3', 'flux'],
            chatModels: chatModels ? chatModels.split(',') : ['gpt-4o', 'qwen-plus']
        };
    }

    async getTasks(userId?: number, limit = 10) {
        return this.prisma.aiTask.findMany({
            where: userId ? { userId } : {},
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    }

    async getChatHistory(userId: number, model?: string, limit = 5) {
        return this.prisma.aiChat.findMany({
            where: {
                userId,
                ...(model ? { model } : {})
            },
            orderBy: { updatedAt: 'desc' },
            take: limit
        });
    }

    async saveChatHistory(userId: number, model: string, messages: any[]) {
        // Find existing chat for the same model for this user
        const existing = await this.prisma.aiChat.findFirst({
            where: { userId, model }
        });

        if (existing) {
            return this.prisma.aiChat.update({
                where: { id: existing.id },
                data: { messages, updatedAt: new Date() }
            });
        }

        return this.prisma.aiChat.create({
            data: { userId, model, messages }
        });
    }

    async getTaskStatus(id: number) {
        return this.prisma.aiTask.findUnique({
            where: { id }
        });
    }

    private async downloadAndProcessImage(externalUrl: string): Promise<{ url: string; thumb: string }> {
        const filename = `ai-cache-${uuidv4()}.jpg`;
        const uploadPath = join(process.cwd(), 'uploads', 'ai-cache');
        const thumbPath = join(uploadPath, 'thumbs');

        if (!fs.existsSync(thumbPath)) {
            fs.mkdirSync(thumbPath, { recursive: true });
        }

        const originalFile = join(uploadPath, filename);
        const thumbFile = join(thumbPath, filename);

        try {
            // 1. Download
            const response = await axios({
                method: 'get',
                url: externalUrl,
                responseType: 'arraybuffer'
            });
            const buffer = Buffer.from(response.data as any);
            fs.writeFileSync(originalFile, buffer);

            // 2. Shrink with Sharp - MORE AGGRESSIVE for performance
            await sharp(buffer)
                .resize(300) // Even smaller
                .jpeg({ quality: 70 }) // lower quality for extreme speed
                .toFile(thumbFile);

            return {
                url: `/uploads/ai-cache/${filename}`,
                thumb: `/uploads/ai-cache/thumbs/${filename}`,
            };
        } catch (err) {
            this.logger.error('Failed to process image locally', err);
            // Fallback to external if local fails (though not ideal)
            return { url: externalUrl, thumb: externalUrl };
        }
    }

    /**
     * Start background generation
     */
    async generateImage(prompt: string, userId?: number, model?: string): Promise<{ taskId: number }> {
        const dbApiKey = await this.systemConfigService.get('AI_API_KEY');
        const dbBaseUrl = await this.systemConfigService.get('AI_BASE_URL');
        const dbImagePath = await this.systemConfigService.get('AI_IMAGE_PATH') || '/v1/images/generations';
        const dbModel = await this.systemConfigService.get('AI_MODEL');

        const apiKey = dbApiKey || this.configService.get<string>('AI_API_KEY');
        const baseUrl = (dbBaseUrl || this.configService.get<string>('AI_BASE_URL') || 'https://api.openai.com').replace(/\/$/, '');
        const apiUrl = `${baseUrl}${dbImagePath.startsWith('/') ? '' : '/'}${dbImagePath}`;
        const finalModel = model || dbModel || this.configService.get<string>('AI_MODEL') || 'dall-e-3';

        // 1. Create a task in DB
        const task = await this.prisma.aiTask.create({
            data: {
                userId,
                prompt,
                model: finalModel,
                status: 'PROCESSING'
            }
        });

        // 2. Run background process (Don't await it!)
        this.runBackgroundGeneration(task.id, apiUrl, apiKey, prompt, finalModel);

        return { taskId: task.id };
    }

    private async runBackgroundGeneration(taskId: number, apiUrl: string, apiKey: string | undefined, prompt: string, model: string) {
        try {
            if (!apiKey) {
                // Mock behavior if no key
                setTimeout(async () => {
                    const mockUrl = `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1024/1792`;
                    const result = await this.downloadAndProcessImage(mockUrl);
                    await this.prisma.aiTask.update({
                        where: { id: taskId },
                        data: {
                            status: 'COMPLETED',
                            resultUrl: result.url,
                            thumbUrl: result.thumb
                        }
                    });
                }, 2000);
                return;
            }

            const isChatEndpoint = apiUrl.includes('chat/completions');
            let body: any;

            if (isChatEndpoint) {
                body = {
                    model: model,
                    messages: [{ role: 'user', content: prompt }],
                    stream: false
                };
            } else {
                body = {
                    model: model,
                    prompt: prompt,
                    n: 1,
                    size: '1024x1792',
                    aspect_ratio: '9:16',
                    response_format: 'url',
                };
            }

            const response = await axios.post<any>(apiUrl, body, {
                headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                timeout: 120000, // Longer timeout for background
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

            if (!imageUrl) throw new Error('No image URL in response');

            const localResult = await this.downloadAndProcessImage(imageUrl);

            await this.prisma.aiTask.update({
                where: { id: taskId },
                data: {
                    status: 'COMPLETED',
                    resultUrl: localResult.url,
                    thumbUrl: localResult.thumb
                }
            });

        } catch (err) {
            this.logger.error(`Task ${taskId} failed:`, err.message);
            await this.prisma.aiTask.update({
                where: { id: taskId },
                data: {
                    status: 'FAILED',
                    error: err.response?.data?.error?.message || err.message
                }
            });
        }
    }

    async generateChat(prompt: string, model: string): Promise<string> {
        const apiKey = await this.systemConfigService.get('AI_API_KEY') || this.configService.get<string>('AI_API_KEY');
        const dbBaseUrl = await this.systemConfigService.get('AI_BASE_URL');
        const dbChatPath = await this.systemConfigService.get('AI_CHAT_PATH') || '/v1/chat/completions';

        const baseUrl = (dbBaseUrl || this.configService.get<string>('AI_BASE_URL') || 'https://api.openai.com').replace(/\/$/, '');
        const apiUrl = `${baseUrl}${dbChatPath.startsWith('/') ? '' : '/'}${dbChatPath}`;

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
        const uploadDir = join(process.cwd(), 'uploads');
        const thumbDir = join(uploadDir, 'thumbs');

        if (!fs.existsSync(thumbDir)) {
            fs.mkdirSync(thumbDir, { recursive: true });
        }

        const filePath = join(uploadDir, filename);
        const thumbPath = join(thumbDir, filename);

        try {
            const response = await axios({
                method: 'get',
                url: data.url,
                responseType: 'arraybuffer'
            });
            const buffer = Buffer.from(response.data as any);
            fs.writeFileSync(filePath, buffer);

            // 2. Generate Thumbnail for Gallery Performance
            await sharp(buffer)
                .resize(400) // Gallery thumb size
                .jpeg({ quality: 80 })
                .toFile(thumbPath);

            // 3. Create record in database
            return this.wallpapersService.create({
                title: data.title,
                description: data.description || 'Generated by AI',
                categories: 'AI生成',
                url: `/uploads/${filename}`,
                thumb: `/uploads/thumbs/${filename}`,
                status: 'PENDING'
            });
        } catch (err) {
            this.logger.error('Failed to save AI image with thumb', err);
            throw err;
        }
    }
}
