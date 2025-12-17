import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WallpapersModule } from './wallpapers/wallpapers.module';

@Module({
  imports: [WallpapersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
