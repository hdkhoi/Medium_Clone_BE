import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('articles/:slug/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async findByArticle(@Param('slug') slug: string) {
    const comments = await this.commentService.findByArticle(slug);
    return {
      message: 'Comments retrieved successfully',
      data: comments,
    };
  }

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Param('slug') slug: string,
    @Req() req,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const authorId = req.user.id as number;

    const { body } = createCommentDto;

    const comment = await this.commentService.create(body, slug, authorId);
    return { message: 'Comment added successfully', data: comment };
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async removeComment(
    @Param('slug') slug: string,
    @Param('id') commentId: number,
    @Req() req,
  ) {
    const authorId = req.user.id as number;
    await this.commentService.remove(slug, authorId, commentId);
    return { message: 'Comment deleted successfully' };
  }
}
