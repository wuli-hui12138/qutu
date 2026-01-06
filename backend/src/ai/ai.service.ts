import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WallpapersService } from '../wallpapers/wallpapers.service';
import { SystemConfigService } from '../system-config/system-config.service';
import { AiModelService } from '../ai-models/ai-model.service';
import { PrismaService } from '../prisma.service';
import axios from 'axios';
import * as fs from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);

    constructor(
        private configService: ConfigService,
        private wallpapersService: WallpapersService,
        private systemConfigService: SystemConfigService,
        private prisma: PrismaService,
        private aiModelService: AiModelService,
    ) { }

    async getModels() {
        const chatModels = await this.aiModelService.findEnabledByType('CHAT');
        const imageModels = await this.aiModelService.findEnabledByType('IMAGE');
        const videoModels = await this.aiModelService.findEnabledByType('VIDEO');
        const musicModels = await this.aiModelService.findEnabledByType('MUSIC');
        const pptModels = await this.aiModelService.findEnabledByType('PPT');

        return {
            chatModels: chatModels.map(m => m.name),
            imageModels: imageModels.map(m => m.name),
            videoModels: videoModels.map(m => m.name),
            musicModels: musicModels.map(m => m.name),
            pptModels: pptModels.map(m => m.name),
            details: {
                chat: chatModels,
                image: imageModels,
                video: videoModels,
                music: musicModels,
                ppt: pptModels
            }
        };
    }

    async getTasks(userId?: any, limit = 10) {
        // Strict numeric check to avoid partial parsing like "123-uuid" -> 123
        const numId = userId !== undefined && userId !== null ? Number(userId) : NaN;
        const isValidUser = !isNaN(numId) && typeof numId === 'number';

        return this.prisma.aiTask.findMany({
            where: isValidUser ? { userId: numId } : {},
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    }

    async getChatHistory(userId: any, model?: string, limit = 5) {
        const numId = userId !== undefined && userId !== null ? Number(userId) : NaN;
        const isValidUser = !isNaN(numId);

        return this.prisma.aiChat.findMany({
            where: {
                ...(isValidUser ? { userId: numId } : { userId: -1 }), // If no valid ID, return empty (unlikely user -1 exists)
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

    async getTaskStatus(id: any) {
        const parsedId = typeof id === 'number' ? id : parseInt(String(id), 10);
        if (isNaN(parsedId)) return null;
        return this.prisma.aiTask.findUnique({
            where: { id: parsedId }
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
    async generateImage(prompt: string, userId?: number, model?: string, aspectRatio?: string): Promise<{ taskId: number }> {
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
        this.runBackgroundGeneration(task.id, apiUrl, apiKey, prompt, finalModel, aspectRatio);

        return { taskId: task.id };
    }

    private async runBackgroundGeneration(taskId: number, apiUrl: string, apiKey: string | undefined, prompt: string, model: string, aspectRatio?: string) {
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
                    response_format: 'url',
                    ...(aspectRatio ? { aspect_ratio: aspectRatio } : { size: '1024x1024' })
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

    async submitToGallery(taskId: any, data: { title: string, categories: string, tags: string, description?: string }) {
        const parsedTaskId = typeof taskId === 'number' ? taskId : parseInt(String(taskId), 10);
        if (isNaN(parsedTaskId)) throw new Error('Invalid Task ID');

        this.logger.log(`Submitting task ${parsedTaskId} to gallery: ${JSON.stringify(data)}`);
        const task = await this.prisma.aiTask.findUnique({ where: { id: parsedTaskId } });
        if (!task || !task.resultUrl) {
            this.logger.error(`Task ${taskId} not found or has no resultUrl`);
            throw new Error('任务不存在或未完成');
        }

        const uploadDir = join(process.cwd(), 'uploads');
        const thumbDir = join(uploadDir, 'thumbs');

        // Ensure directories exist
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

        const targetFilename = `ai-submit-${uuidv4()}.jpg`;
        const targetPath = join(uploadDir, targetFilename);
        const targetThumbPath = join(thumbDir, targetFilename);

        const isRemote = (url: string) => url.startsWith('http');

        try {
            // 1. Process Main Image
            if (isRemote(task.resultUrl)) {
                this.logger.log(`Downloading remote resultUrl: ${task.resultUrl}`);
                const response = await axios({
                    method: 'get',
                    url: task.resultUrl,
                    responseType: 'arraybuffer'
                });
                fs.writeFileSync(targetPath, Buffer.from(response.data as any));
            } else {
                const sourcePath = join(process.cwd(), task.resultUrl.replace(/^\//, ''));
                if (fs.existsSync(sourcePath)) {
                    fs.copyFileSync(sourcePath, targetPath);
                } else {
                    this.logger.error(`Source file not found: ${sourcePath}`);
                    throw new Error('原始文件不存在');
                }
            }

            // 2. Process Thumbnail
            if (task.thumbUrl && isRemote(task.thumbUrl)) {
                this.logger.log(`Downloading remote thumbUrl: ${task.thumbUrl}`);
                const response = await axios({
                    method: 'get',
                    url: task.thumbUrl,
                    responseType: 'arraybuffer'
                });
                fs.writeFileSync(targetThumbPath, Buffer.from(response.data as any));
            } else if (task.thumbUrl) {
                const sourceThumbPath = join(process.cwd(), task.thumbUrl.replace(/^\//, ''));
                if (fs.existsSync(sourceThumbPath)) {
                    fs.copyFileSync(sourceThumbPath, targetThumbPath);
                } else {
                    this.logger.log('Local thumb not found, generating from targetPath');
                    const buffer = fs.readFileSync(targetPath);
                    await sharp(buffer).resize(400).jpeg({ quality: 80 }).toFile(targetThumbPath);
                }
            } else {
                this.logger.log('No thumbUrl provided, generating from targetPath');
                const buffer = fs.readFileSync(targetPath);
                await sharp(buffer).resize(400).jpeg({ quality: 80 }).toFile(targetThumbPath);
            }

            const result = await this.wallpapersService.create({
                title: data.title,
                description: data.description || task.prompt,
                categories: data.categories,
                tags: data.tags,
                url: `/uploads/${targetFilename}`,
                thumb: `/uploads/thumbs/${targetFilename}`,
                status: 'PENDING',
                authorId: task.userId
            });
            this.logger.log(`Gallery submission created: ${result.id}`);
            return result;
        } catch (err) {
            this.logger.error(`Failed to submit AI image to gallery for task ${taskId}: ${err.message}`, err.stack);
            throw err;
        }
    }

    async deleteTask(id: number) {
        return this.deleteTasks([id]);
    }

    async deleteTasks(ids: number[]) {
        const tasks = await this.prisma.aiTask.findMany({
            where: { id: { in: ids } }
        });

        const isRemote = (url: string | null) => url && url.startsWith('http');

        for (const task of tasks) {
            // Delete files
            try {
                if (task.resultUrl && !isRemote(task.resultUrl)) {
                    const fullPath = join(process.cwd(), task.resultUrl.replace(/^\//, ''));
                    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
                }
                if (task.thumbUrl && !isRemote(task.thumbUrl)) {
                    const fullThumbPath = join(process.cwd(), task.thumbUrl.replace(/^\//, ''));
                    if (fs.existsSync(fullThumbPath)) fs.unlinkSync(fullThumbPath);
                }
            } catch (err) {
                this.logger.error(`Failed to delete files for task ${task.id}: ${err.message}`);
            }
        }

        return this.prisma.aiTask.deleteMany({
            where: { id: { in: ids } }
        });
    }
}
