import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TopicsService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        // Handle default cover if not provided
        if (!data.cover) {
            data.cover = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.title)}&background=random&size=512&color=fff&bold=true&font-size=0.33`;
        }
        return this.prisma.topic.create({
            data: {
                ...data,
                status: 'PENDING', // All new topics start as PENDING
            },
        });
    }

    async findAll() {
        return this.prisma.topic.findMany({
            where: {
                isActive: true,
                status: 'APPROVED' // Only show approved topics to users
            },
            include: {
                _count: {
                    select: { images: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findAllAdmin() {
        return this.prisma.topic.findMany({
            include: {
                _count: {
                    select: { images: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateStatus(id: number, status: string) {
        return this.prisma.topic.update({
            where: { id },
            data: { status }
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

    async findOneAdmin(id: number) {
        return this.prisma.topic.findUnique({
            where: { id },
            include: {
                images: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    }

    async update(id: number, data: any) {
        return this.prisma.topic.update({
            where: { id },
            data,
        });
    }

    async remove(id: number) {
        return this.prisma.topic.delete({
            where: { id },
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
