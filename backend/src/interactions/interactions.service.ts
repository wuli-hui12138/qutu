import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class InteractionsService {
    constructor(private prisma: PrismaService) { }

    async toggleFavorite(userId: number, imageId: number) {
        return this.prisma.$transaction(async (tx) => {
            const existing = await tx.favorite.findUnique({
                where: {
                    userId_imageId: { userId, imageId }
                }
            });

            if (existing) {
                // Already liked, so UNLIKE
                await tx.favorite.delete({
                    where: { id: existing.id }
                });

                // Safety: Get current and decrement, ensuring >= 0
                const img = await tx.image.findUnique({ where: { id: imageId } });
                const newImage = await tx.image.update({
                    where: { id: imageId },
                    data: { likes: Math.max(0, (img?.likes || 1) - 1) }
                });
                return { isLiked: false, likes: newImage.likes };
            } else {
                // Not liked, so LIKE
                await tx.favorite.create({
                    data: { userId, imageId }
                });
                const newImage = await tx.image.update({
                    where: { id: imageId },
                    data: { likes: { increment: 1 } }
                });
                return { isLiked: true, likes: newImage.likes };
            }
        });
    }

    async syncAllLikeCounts() {
        const images = await this.prisma.image.findMany({
            select: { id: true }
        });

        for (const img of images) {
            const count = await this.prisma.favorite.count({
                where: { imageId: img.id }
            });
            await this.prisma.image.update({
                where: { id: img.id },
                data: { likes: count }
            });
        }
        return { success: true };
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
