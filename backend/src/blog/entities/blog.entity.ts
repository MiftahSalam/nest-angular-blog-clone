import { UserEntity } from '../../../src/user/entities/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import slugify from 'slugify';

@Entity('blogs')
export class BlogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  slug: string;

  @Column({ type: 'varchar' })
  image_url: string;

  @Column({ type: 'varchar' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'text', nullable: false })
  content: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.blogs, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  author: UserEntity;

  @BeforeInsert()
  private async slugifyTitle() {
    this.slug = slugify(this.title);
  }
}
