import { Exclude, Expose } from 'class-transformer';
import { BaseEntity } from 'src/common/class/base-entity.class';
import { IUser } from 'src/common/interfaces/user.interface';
import { ArticleEntity } from 'src/modules/article/entities/article.entity';
import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';

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

  // User theo dõi ai (following)
  @Exclude()
  @ManyToMany(() => UserEntity, (user) => user.followers)
  @JoinTable({
    name: 'user_follows', // ← Tên bảng trung gian
    joinColumn: { name: 'follower_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'following_id', referencedColumnName: 'id' },
  })
  following: UserEntity[];

  // Ai theo dõi user này (followers)
  @Exclude()
  @ManyToMany(() => UserEntity, (user) => user.following)
  followers: UserEntity[];

  @Exclude()
  @ManyToMany(() => ArticleEntity, (article) => article.favoritedBy)
  favoritedArticles: ArticleEntity[];

  @Exclude()
  declare id: number;

  @Exclude()
  declare created_at: Date;

  @Exclude()
  declare updated_at: Date;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
