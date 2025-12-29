import { Module } from '@nestjs/common';
import { AiModelService } from './ai-model.service';
import { AiModelController } from './ai-model.controller';
import { PrismaService } from '../prisma.service';

@Module({
    providers: [AiModelService, PrismaService],
    controllers: [AiModelController],
    exports: [AiModelService]
})
export class AiModelModule { }
