import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, UserModule, ArticleModule],
  controllers: [AuthController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
