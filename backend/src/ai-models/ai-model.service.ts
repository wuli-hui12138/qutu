import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AiModelService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.aiModel.findMany({
            orderBy: [{ type: 'asc' }, { sortOrder: 'desc' }]
        });
    }

    async findEnabledByType(type: string) {
        return this.prisma.aiModel.findMany({
            where: { type, isEnabled: true },
            orderBy: { sortOrder: 'desc' }
        });
    }

    async create(data: any) {
        return this.prisma.aiModel.create({ data });
    }

    async update(id: number, data: any) {
        return this.prisma.aiModel.update({
            where: { id },
            data
        });
    }

    async delete(id: number) {
        return this.prisma.aiModel.delete({
            where: { id }
        });
    }
}
