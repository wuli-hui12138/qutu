import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WallpapersModule } from './wallpapers/wallpapers.module';
import { TagsModule } from './tags/tags.module';
import { CategoriesModule } from './categories/categories.module';
import { TopicsModule } from './topics/topics.module';
import { AiModule } from './ai/ai.module';
import { SystemConfigModule } from './system-config/system-config.module';
import { UsersModule } from './users/users.module';
import { InteractionsModule } from './interactions/interactions.module';
import { AiModelModule } from './ai-models/ai-model.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    WallpapersModule,
    TagsModule,
    CategoriesModule,
    TopicsModule,
    UsersModule,
    InteractionsModule,
    AiModule,
    SystemConfigModule,
    AiModelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
