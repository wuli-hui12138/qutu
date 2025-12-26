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

    async getTasks(limit = 10) {
        return this.prisma.aiTask.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit
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

            // 2. Shrink with Sharp
            await sharp(buffer)
                .resize(400) // Small enough for thumbnails
                .jpeg({ quality: 80 })
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
    async generateImage(prompt: string, model?: string): Promise<{ taskId: number }> {
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
                prompt,
                model: finalModel,
                status: 'PROCESSING'
            }
        });

        // 2. Run background process (Don't await it!)
        this.runBackgroundGeneration(task.id, apiUrl, apiKey, prompt, finalModel);

        return { taskId: task.id };
    }

    private async runBackgroundGeneration(taskId: number, apiUrl: string, apiKey: string, prompt: string, model: string) {
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
