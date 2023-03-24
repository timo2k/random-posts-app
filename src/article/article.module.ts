import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [AuthModule],
  controllers: [ArticleController],
  providers: [PrismaService, ArticleService],
})
export class ArticleModule {}
