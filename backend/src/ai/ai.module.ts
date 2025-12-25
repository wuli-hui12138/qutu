import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { WallpapersModule } from '../wallpapers/wallpapers.module';
import { SystemConfigModule } from '../system-config/system-config.module';

@Module({
    imports: [WallpapersModule, SystemConfigModule],
    controllers: [AiController],
    providers: [AiService],
})
export class AiModule { }
