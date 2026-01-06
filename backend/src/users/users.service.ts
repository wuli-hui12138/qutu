import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async login(openid: string, nickname?: string, avatar?: string) {
        return this.prisma.user.upsert({
            where: { openid },
            update: {
                ...(nickname && { nickname }),
                ...(avatar && { avatar }),
            },
            create: {
                openid,
                nickname: nickname || 'WeChat User',
                avatar,
            },
        });
    }

    async findOne(id: any) {
        const numId = typeof id === 'number' ? id : parseInt(String(id), 10);
        if (isNaN(numId)) return null;
        return this.prisma.user.findUnique({
            where: { id: numId },
            include: {
                _count: {
                    select: { followers: true, following: true, images: true }
                }
            }
        });
    }

    async follow(followingId: number, followerId: number) {
        return this.prisma.follow.create({
            data: {
                followerId,
                followingId,
            }
        });
    }

    async unfollow(followingId: number, followerId: number) {
        return this.prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                }
            }
        });
    }
}
