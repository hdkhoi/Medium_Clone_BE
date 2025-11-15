import { CommentEntity } from 'src/modules/comment/entities/comment.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  Check,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from 'src/common/class/base-entity.class';
import { TagEntity } from 'src/modules/tag/entities/tag.entity';
import { Exclude, Expose, Transform } from 'class-transformer';

@Entity({ name: 'articles' })
export class ArticleEntity extends BaseEntity {
  @Column({ length: 100, unique: true })
  title: string;

  @Column({ length: 100, unique: true })
  slug: string;

  @Column({ length: 100 })
  description: string;

  @Column({ length: 5000 })
  body: string;

  @ManyToMany(() => TagEntity, { eager: true })
  @JoinTable()
  @Transform(({ value }) => value.map((tag: TagEntity) => tag.name) as string[])
  tagList: TagEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.article)
  comments: CommentEntity[];

  @ManyToOne(() => UserEntity, (user) => user.articles, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @Exclude()
  declare id: number;
}
