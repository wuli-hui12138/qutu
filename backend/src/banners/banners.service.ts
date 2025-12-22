import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BannersService {
    constructor(private prisma: PrismaService) { }

    findAll(activeOnly: boolean = false) {
        return this.prisma.banner.findMany({
            where: activeOnly ? { isActive: true } : {},
            orderBy: { order: 'asc' },
        });
    }

    create(data: any) {
        return this.prisma.banner.create({ data });
    }

    update(id: number, data: any) {
        return this.prisma.banner.update({
            where: { id },
            data,
        });
    }

    remove(id: number) {
        return this.prisma.banner.delete({ where: { id } });
    }
}
