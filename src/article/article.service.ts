import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, VoteType } from '@prisma/client';
import { VoteLimitException } from 'src/errors';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  async createArticle(data: Prisma.ArticleCreateInput) {
    return this.prisma.article.create({ data });
  }

  async createVote(userId: string, articleId: string, voteType: VoteType) {
    const userVoteCount = await this.prisma.vote.count({
      where: {
        userId: userId,
      },
    });

    if (userVoteCount >= 10) {
      throw new VoteLimitException();
    }

    return this.prisma.vote.create({
      data: {
        user: { connect: { id: userId } },
        article: { connect: { id: articleId } },
        voteType: voteType,
      },
    });
  }

  async getArticleById(id: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });

    if (!article) {
      throw new NotFoundException('Article not found');
    }
  }
}
