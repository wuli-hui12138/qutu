import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SystemConfigService implements OnModuleInit {
    constructor(private prisma: PrismaService) { }

    async onModuleInit() {
        // Optionally seed default keys if they don't exist
        const defaultConfigs = [
            { key: 'AI_API_KEY', value: '', description: 'AI API Key (Bearer Token)' },
            { key: 'AI_BASE_URL', value: 'https://api.openai.com', description: 'AI 接口基础域名' },
            { key: 'AI_IMAGE_PATH', value: '/v1/images/generations', description: 'AI 绘图请求路径' },
            { key: 'AI_CHAT_PATH', value: '/v1/chat/completions', description: 'AI 对话请求路径' },
            { key: 'AI_IMAGE_MODELS', value: 'dall-e-3,flux,gpt-4o-image', description: '绘图模型列表 (英文逗号分隔)' },
            { key: 'AI_CHAT_MODELS', value: 'gpt-4o,gpt-4-turbo,qwen-plus', description: '对话模型列表 (英文逗号分隔)' },
        ];

        for (const config of defaultConfigs) {
            await (this.prisma as any).systemConfig.upsert({
                where: { key: config.key },
                update: {},
                create: config,
            }).catch(() => {
                // Ignore errors if table doesn't exist yet during build/startup
            });
        }
    }

    findAll() {
        return (this.prisma as any).systemConfig.findMany({
            orderBy: { key: 'asc' },
        });
    }

    async get(key: string): Promise<string | null> {
        const config = await (this.prisma as any).systemConfig.findUnique({
            where: { key },
        });
        return config?.value || null;
    }

    async set(key: string, value: string, description?: string) {
        return (this.prisma as any).systemConfig.upsert({
            where: { key },
            update: { value, description },
            create: { key, value, description },
        });
    }

    async remove(key: string) {
        return (this.prisma as any).systemConfig.delete({
            where: { key },
        });
    }
}
