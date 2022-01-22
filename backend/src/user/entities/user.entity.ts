import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  fullname: string;

  @Column({
    type: 'varchar',
    nullable: false,
    select: false,
  })
  password: string;

  @Column({
    type: 'varchar',
  })
  image_url: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
