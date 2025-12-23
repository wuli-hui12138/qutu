import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TopicsService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.topic.create({
            data,
        });
    }

    async findAll() {
        return this.prisma.topic.findMany({
            where: { isActive: true },
            include: {
                _count: {
                    select: { images: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: number) {
        return this.prisma.topic.findUnique({
            where: { id },
            include: {
                images: {
                    where: { status: 'APPROVED', isVisible: true },
                    include: {
                        categories: true,
                        tags: true,
                    },
                },
            },
        });
    }

    async submitToTopic(topicId: number, imageId: number) {
        return this.prisma.image.update({
            where: { id: imageId },
            data: {
                topicId: topicId,
            },
        });
    }
}
