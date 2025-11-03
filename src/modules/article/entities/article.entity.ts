import { CommentEntity } from 'src/modules/comment/entities/comment.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from 'src/common/class/base-entity.class';

@Entity({ name: 'articles' })
export class ArticleEntity extends BaseEntity {
  @Column({ length: 100, nullable: false })
  title: string;

  @Column({ length: 100, nullable: false })
  slug: string;

  @Column({ length: 300, nullable: false })
  description: string;

  @Column('simple-array')
  tagList: string[];

  @OneToMany(() => CommentEntity, (comment) => comment.article)
  comments: CommentEntity[];

  @ManyToOne(() => UserEntity, (user) => user.articles, { eager: true })
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;
}
