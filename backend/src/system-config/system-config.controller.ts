import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SystemConfigService } from './system-config.service';

@Controller('system-configs')
export class SystemConfigController {
    constructor(private readonly systemConfigService: SystemConfigService) { }

    @Get()
    findAll() {
        return this.systemConfigService.findAll();
    }

    @Post()
    create(@Body() data: { key: string; value: string; description?: string }) {
        return this.systemConfigService.set(data.key, data.value, data.description);
    }

    @Patch(':key')
    update(@Param('key') key: string, @Body('value') value: string) {
        return this.systemConfigService.set(key, value);
    }

    @Delete(':key')
    remove(@Param('key') key: string) {
        return this.systemConfigService.remove(key);
    }
}
