import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class InteractionsService {
    constructor(private prisma: PrismaService) { }

    async toggleFavorite(userId: number, imageId: number) {
        const existing = await this.prisma.favorite.findUnique({
            where: {
                userId_imageId: { userId, imageId }
            }
        });

        if (existing) {
            return this.prisma.favorite.delete({
                where: { id: existing.id }
            });
        }

        return this.prisma.favorite.create({
            data: { userId, imageId }
        });
    }

    async getFavorites(userId: number) {
        return this.prisma.favorite.findMany({
            where: { userId },
            include: {
                image: {
                    include: {
                        categories: true,
                        tags: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async recordHistory(userId: number, imageId: number) {
        return this.prisma.history.upsert({
            where: {
                userId_imageId: { userId, imageId }
            },
            update: {
                updatedAt: new Date()
            },
            create: { userId, imageId }
        });
    }

    async getHistory(userId: number) {
        return this.prisma.history.findMany({
            where: { userId },
            include: {
                image: {
                    include: {
                        categories: true,
                        tags: true
                    }
                }
            },
            orderBy: { updatedAt: 'desc' },
            take: 50
        });
    }
}
