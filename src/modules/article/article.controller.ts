import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Put,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { FindManyArticlesQueryDto } from './dto/find-many-articles-query.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto, @Req() req) {
    const authorId = req.user.id as number;

    const article = await this.articleService.create(
      authorId,
      createArticleDto,
    );

    return { message: 'Article created successfully', data: article };
  }

  @Get()
  async findMany(@Query() findManyArticlesQueryDto: FindManyArticlesQueryDto) {
    const articles = await this.articleService.findMany(
      findManyArticlesQueryDto,
    );
    return {
      message: 'Articles retrieved successfully',
      data: articles,
    };
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const article = await this.articleService.findBySlug(slug);

    return { message: 'Article found successfully', data: article };
  }

  @UseGuards(JwtGuard)
  @Put(':slug')
  async update(
    @Param('slug') slug: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    const article = await this.articleService.update(slug, updateArticleDto);
    return { message: 'Article updated successfully', data: article };
  }

  @UseGuards(JwtGuard)
  @Delete(':slug')
  async remove(@Param('slug') slug: string, @Req() req) {
    const authorId = req.user.id as number;
    await this.articleService.remove(slug, authorId);
    return { message: 'Article deleted successfully' };
  }
}
