import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/class/base-entity.class';
import { IUser } from 'src/common/interfaces/user.interface';
import { ArticleEntity } from 'src/modules/article/entities/article.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ length: 20, nullable: false })
  name: string;

  @Column({ length: 30, unique: true, nullable: false })
  email: string;

  @Column({ length: 10, unique: true, nullable: false })
  username: string;

  @Exclude()
  @Column({ length: 200, nullable: false, select: false })
  password: string;

  @Column({ length: 200, default: '' })
  bio: string;

  @Column({ length: 100, default: '' })
  image: string;

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  @Exclude()
  declare created_at: Date;

  @Exclude()
  declare updated_at: Date;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
