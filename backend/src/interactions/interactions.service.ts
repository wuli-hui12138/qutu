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
                return tx.image.update({
                    where: { id: imageId },
                    data: { likes: { decrement: 1 } }
                });
            } else {
                // Not liked, so LIKE
                await tx.favorite.create({
                    data: { userId, imageId }
                });
                return tx.image.update({
                    where: { id: imageId },
                    data: { likes: { increment: 1 } }
                });
            }
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
