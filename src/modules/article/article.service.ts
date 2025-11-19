import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { ArrayContains, In, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { TagEntity } from '../tag/entities/tag.entity';
import { TagService } from '../tag/tag.service';
import { FindManyArticlesQueryDto } from './dto/find-many-articles-query.dto';
import { CreateCommentDto } from '../comment/dto/create-comment.dto';
import { CommentService } from '../comment/comment.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private readonly userService: UserService,
    private readonly tagService: TagService,
    // private readonly commentSerivice: CommentService,
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
        ...(favorited && {
          favoritedBy: { username: favorited },
        }),
      },
      take: limit,
      skip: offset,
    });

    if (articles.length === 0) {
      return {
        message: 'No articles found',
        data: { articles: [], articlesCount: 0 },
      };
    }
    return { articles, articlesCount: count };
  }

  async findBySlug(slug: string) {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: { author: true, favoritedBy: true, tagList: true },
    });

    if (!article) {
      throw new ConflictException('Get article failed', {
        description: 'Article not found',
      });
    }
    return article;
  }

  async findByAuthor(authorId: number) {
    return await this.articleRepository.find({
      where: { author: { id: authorId } },
      relations: { author: true, tagList: true },
    });
  }

  async getFeed(userId: number, query: FindManyArticlesQueryDto) {
    const { limit, offset } = query;

    const followingUsers = await this.userService.getFollowing(userId);
    const followingUsersId = followingUsers.map((user) => user.id);
    if (followingUsersId.length === 0) {
      return { articles: [], articlesCount: 0 };
    }

    const articles = await this.articleRepository.find({
      where: { author: { id: In(followingUsersId) } },
      take: limit,
      skip: offset,
      relations: { author: true, tagList: true },
    });

    return { articles, articlesCount: articles.length };
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

  async favorite(slug: string, currentUserId: number) {
    const article = await this.findBySlug(slug);
    const currentUser = await this.userService.findById(currentUserId);

    if (article.favoritedBy.some((user) => user.id === currentUser.id)) {
      throw new ConflictException('Favorite failed', {
        description: 'You have already favorited this article',
      });
    }

    article.favoritedBy.push(currentUser);
    const updatedArticle = await this.articleRepository.save(article);
    return updatedArticle;
  }

  async unfavorite(slug: string, currentUserId: number) {
    const article = await this.findBySlug(slug);
    const currentUser = await this.userService.findById(currentUserId);

    if (!article.favoritedBy.some((user) => user.id === currentUser.id)) {
      throw new ConflictException('Unfavorite failed', {
        description: 'You have not favorited this article',
      });
    }

    article.favoritedBy = article.favoritedBy.filter(
      (user) => user.id !== currentUser.id,
    );
    const updatedArticle = await this.articleRepository.save(article);
    return updatedArticle;
  }
}
