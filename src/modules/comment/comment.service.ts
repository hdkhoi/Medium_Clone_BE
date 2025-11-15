import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { ArticleService } from '../article/article.service';
import { UserService } from '../user/user.service';
import { ConflictException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    private readonly articleService: ArticleService,
    private readonly userService: UserService,
  ) {}

  async create(body: string, slug: string, authorId: number) {
    const author = await this.userService.findById(authorId);

    const article = await this.articleService.findBySlug(slug);

    const newComment = this.commentRepository.create({
      body,
      article: { id: article.id },
      author: author,
    });
    const result = await this.commentRepository.save(newComment);
    return result;
  }

  async findById(id: number) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async findByArticle(slug: string) {
    const article = await this.articleService.findBySlug(slug);
    const comments = await this.commentRepository.find({
      where: { article: { id: article.id } },
      relations: { author: true },
    });
    return comments;
  }

  async remove(slug: string, authorId: number, commentId: number) {
    const comment = await this.findById(commentId);
    if (comment.author.id !== authorId) {
      throw new ForbiddenException('Delete comment failed', {
        description: 'You are not the author of this comment',
      });
    }

    const article = await this.articleService.findBySlug(slug);
    if (comment.article.id !== article.id) {
      throw new ConflictException('Delete comment failed', {
        description: 'Comment does not belong to this article',
      });
    }

    await this.commentRepository.delete({ id: commentId });
  }
}
