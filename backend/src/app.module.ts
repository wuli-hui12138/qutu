import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WallpapersModule } from './wallpapers/wallpapers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WallpapersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
