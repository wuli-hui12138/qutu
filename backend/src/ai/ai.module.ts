import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { WallpapersModule } from '../wallpapers/wallpapers.module';

@Module({
    imports: [WallpapersModule],
    controllers: [AiController],
    providers: [AiService],
})
export class AiModule { }
