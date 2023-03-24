import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { HttpExceptionFilter } from 'src/filters';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateArticleDto } from './dtos/create-article.dto';
import { CreateVoteDto } from './dtos/create-vote.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('articles')
@UseFilters(HttpExceptionFilter)
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new article' })
  @ApiBody({ type: CreateArticleDto })
  @ApiCreatedResponse({
    description: 'The article has been successfully created.',
  })
  async createArticle(@Body() data: CreateArticleDto) {
    return this.articleService.createArticle(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an article by ID' })
  @ApiParam({ name: 'id', description: 'Article ID' })
  @ApiOkResponse({ description: 'The article has been successfully fetched.' })
  async getArticleById(@Param('id', ParseUUIDPipe) id: string) {
    return this.articleService.getArticleById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/vote')
  @ApiOperation({ summary: 'Create a vote for an article' })
  @ApiParam({ name: 'id', description: 'Article ID' })
  @ApiBody({ type: CreateVoteDto })
  @ApiCreatedResponse({
    description: 'The vote has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'User has already voted 10 times.' })
  async createVote(
    @Param('id', ParseUUIDPipe) articleId: string,
    @Body() { userId, voteType }: CreateVoteDto,
  ) {
    return this.articleService.createVote(userId, articleId, voteType);
  }
}
