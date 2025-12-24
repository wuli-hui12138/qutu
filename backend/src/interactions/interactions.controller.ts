import { Controller, Post, Get, Body, Query, Param, Delete } from '@nestjs/common';
import { InteractionsService } from './interactions.service';

@Controller('interactions')
export class InteractionsController {
    constructor(private readonly interactionsService: InteractionsService) { }

    @Post('favorite')
    toggleFavorite(@Body('userId') userId: number, @Body('imageId') imageId: number) {
        return this.interactionsService.toggleFavorite(userId, imageId);
    }

    @Get('favorites/:userId')
    getFavorites(@Param('userId') userId: string) {
        return this.interactionsService.getFavorites(+userId);
    }

    @Post('history')
    recordHistory(@Body('userId') userId: number, @Body('imageId') imageId: number) {
        return this.interactionsService.recordHistory(userId, imageId);
    }

    @Get('history/:userId')
    getHistory(@Param('userId') userId: string) {
        return this.interactionsService.getHistory(+userId);
    }
}
