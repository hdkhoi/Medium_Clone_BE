import { BaseEntity } from 'src/common/class/base-entity.class';
import { ArticleEntity } from 'src/modules/article/entities/article.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'comments' })
export class CommentEntity extends BaseEntity {
  @Column({ length: 200, nullable: false })
  body: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  @ManyToOne(() => ArticleEntity, (article) => article.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'articleId' })
  article: ArticleEntity;
}
