import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CollectionsService {
    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.collection.findMany({
            include: {
                images: {
                    take: 4,
                    orderBy: { views: 'desc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    findOne(id: number) {
        return this.prisma.collection.findUnique({
            where: { id },
            include: { images: true }
        });
    }

    create(data: any) {
        return this.prisma.collection.create({ data });
    }

    remove(id: number) {
        return this.prisma.collection.delete({ where: { id } });
    }
}
