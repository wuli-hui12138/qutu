import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('login')
    login(@Body('openid') openid: string, @Body('nickname') nickname?: string, @Body('avatar') avatar?: string) {
        return this.usersService.login(openid, nickname, avatar);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Post(':id/follow')
    follow(@Param('id') id: string, @Body('followerId') followerId: number) {
        return this.usersService.follow(+id, followerId);
    }

    @Post(':id/unfollow')
    unfollow(@Param('id') id: string, @Body('followerId') followerId: number) {
        return this.usersService.unfollow(+id, followerId);
    }
}
