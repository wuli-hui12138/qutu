import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class InteractionsService {
    constructor(private prisma: PrismaService) { }

    async toggleFavorite(userId: any, imageId: any) {
        const uId = typeof userId === 'number' ? userId : parseInt(String(userId), 10);
        const iId = typeof imageId === 'number' ? imageId : parseInt(String(imageId), 10);
        if (isNaN(uId)) throw new Error('Invalid UserId');
        if (isNaN(iId)) throw new Error('Invalid ImageId');

        return this.prisma.$transaction(async (tx) => {
            const existing = await tx.favorite.findUnique({
                where: {
                    userId_imageId: { userId: uId, imageId: iId }
                }
            });

            if (existing) {
                // Already liked, so UNLIKE
                await tx.favorite.delete({
                    where: { id: existing.id }
                });

                // Safety: Get current and decrement, ensuring >= 0
                const img = await tx.image.findUnique({ where: { id: iId } });
                const newImage = await tx.image.update({
                    where: { id: iId },
                    data: { likes: Math.max(0, (img?.likes || 1) - 1) }
                });
                return { isLiked: false, likes: newImage.likes };
            } else {
                // Not liked, so LIKE
                await tx.favorite.create({
                    data: { userId: uId, imageId: iId }
                });
                const newImage = await tx.image.update({
                    where: { id: iId },
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

    async getFavorites(userId: any) {
        const numId = typeof userId === 'number' ? userId : parseInt(String(userId), 10);
        if (isNaN(numId)) return [];
        return this.prisma.favorite.findMany({
            where: { userId: numId },
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

    async recordHistory(userId: any, imageId: any) {
        const uId = typeof userId === 'number' ? userId : parseInt(String(userId), 10);
        const iId = typeof imageId === 'number' ? imageId : parseInt(String(imageId), 10);
        if (isNaN(uId) || isNaN(iId)) return;

        return this.prisma.history.upsert({
            where: {
                userId_imageId: { userId: uId, imageId: iId }
            },
            update: {
                updatedAt: new Date()
            },
            create: { userId: uId, imageId: iId }
        });
    }

    async getHistory(userId: any) {
        const numId = typeof userId === 'number' ? userId : parseInt(String(userId), 10);
        if (isNaN(numId)) return [];
        return this.prisma.history.findMany({
            where: { userId: numId },
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
