import { MaxLength } from 'class-validator';
import { COMMENT_BODY_MAX_LENGTH } from 'src/common/constants/comment.constants';
import { NumberRequired, StringRequired } from 'src/common/decorators';

export class CreateCommentDto {
  @StringRequired('Comment body')
  @MaxLength(COMMENT_BODY_MAX_LENGTH, {
    message: `Comment body must not exceed ${COMMENT_BODY_MAX_LENGTH} characters.`,
  })
  body: string;
}
