import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EntityCore } from 'src/core/entity';
import { UserDto } from '../dtos/user.dto';

@Entity('users')
export class UserEntity implements EntityCore<UserDto> {
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

  toDto(): Promise<UserDto> {
    const dto: UserDto = {
      id: this.id,
      username: this.username,
      email: this.email,
      fullname: this.fullname,
      image_url: this.image_url,
    };
    return Promise.resolve(dto);
  }
}
