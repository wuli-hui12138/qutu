import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { WallpapersModule } from '../wallpapers/wallpapers.module';
import { SystemConfigModule } from '../system-config/system-config.module';
import { PrismaService } from '../prisma.service';
import { AiModelModule } from '../ai-models/ai-model.module';

@Module({
    imports: [WallpapersModule, SystemConfigModule, AiModelModule],
    controllers: [AiController],
    providers: [AiService, PrismaService],
})
export class AiModule { }
