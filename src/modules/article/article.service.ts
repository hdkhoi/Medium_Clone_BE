import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { ArrayContains, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { TagEntity } from '../tag/entities/tag.entity';
import { TagService } from '../tag/tag.service';
import { FindManyArticlesQueryDto } from './dto/find-many-articles-query.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private readonly userService: UserService,
    private readonly tagService: TagService,
  ) {}

  async validateTitle(title: string) {
    const article = await this.articleRepository.findOne({
      where: { title },
    });

    if (article) {
      throw new ConflictException('Create article failed', {
        description: 'Title already in use',
      });
    }
  }

  async createTag(name: string) {
    let tag = await this.tagService.findByName(name);

    if (!tag) {
      tag = await this.tagService.create({ name });
    }
    return tag;
  }

  async create(authorId: number, createArticleDto: CreateArticleDto) {
    const { title, tagList, ...rest } = createArticleDto;

    await this.validateTitle(title);

    const slug = title.toLowerCase().trim().replace(/\s+/g, '-');

    let tags: TagEntity[] = [];
    if (tagList) {
      tags = await Promise.all(
        tagList.map(async (tagName) => this.createTag(tagName)),
      );
    }

    const author = await this.userService.findById(authorId);

    const newArticle = this.articleRepository.create({
      slug,
      title,
      author,
      ...(tags.length > 0 && { tagList: tags }),
      ...rest,
    });

    await this.articleRepository.save(newArticle);

    return newArticle;
  }

  async findMany(findManyArticlesQueryDto: FindManyArticlesQueryDto) {
    const { tag, author, favorited, limit, offset } = findManyArticlesQueryDto;

    const [articles, count] = await this.articleRepository.findAndCount({
      relations: { tagList: true },
      where: {
        ...(tag && { tagList: { name: tag } }),
        ...(author && { author: { username: author } }),
      },
      take: limit,
      skip: offset,
      order: { created_at: 'DESC' },
    });
    return { articles, articlesCount: count };
  }

  async findBySlug(slug: string) {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: { author: true },
    });

    if (!article) {
      throw new ConflictException('Get article failed', {
        description: 'Article not found',
      });
    }
    return article;
  }

  async update(slug: string, updateArticleDto: UpdateArticleDto) {
    const article = await this.articleRepository.findOne({ where: { slug } });
    if (!article) {
      throw new ConflictException('Update article failed', {
        description: 'Article not found',
      });
    }

    const { title, tagList, ...rest } = updateArticleDto;

    if (title && title !== article.title) {
      await this.validateTitle(title);
      article.slug = title.toLowerCase().trim().replace(/\s+/g, '-');
    }

    if (tagList) {
      const tags = await Promise.all(
        tagList.map(async (tagName) => this.createTag(tagName)),
      );
      // article.tagList.push(...tags);
      for (const tag of tags) {
        if (!article.tagList.find((t) => t.name === tag.name)) {
          article.tagList.push(tag);
        }
      }
    }

    Object.assign(article, rest);

    const updatedArticle = await this.articleRepository.save(article);

    return updatedArticle;
  }

  async remove(slug: string, authorId: number) {
    const article = await this.articleRepository.findOne({ where: { slug } });
    if (!article) {
      throw new ConflictException('Delete article failed', {
        description: 'Article not found',
      });
    }

    if (article.author.id !== authorId) {
      throw new ForbiddenException('Delete article failed', {
        description: 'You are not the author of this article',
      });
    }

    return await this.articleRepository.softRemove(article);
  }
}
