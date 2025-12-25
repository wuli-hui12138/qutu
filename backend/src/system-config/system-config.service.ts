import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SystemConfigService implements OnModuleInit {
    constructor(private prisma: PrismaService) { }

    async onModuleInit() {
        // Optionally seed default keys if they don't exist
        const defaultConfigs = [
            { key: 'AI_API_KEY', value: '', description: 'AI API Key (Bearer Token)' },
            { key: 'AI_API_URL', value: 'https://api.openai.com/v1/images/generations', description: 'AI API Endpoint (e.g., .../v1/images/generations 或 .../v1/chat/completions)' },
            { key: 'AI_MODEL', value: 'dall-e-3', description: 'AI Model Name (e.g., dall-e-3, gpt-4o-image, flux, recraftv3)' },
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
