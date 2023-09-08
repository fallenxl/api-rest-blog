import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { User } from '../user/user.entity';

@Entity()
export class Post {
  @PrimaryColumn()
  id: string;

  @Column({ length: 50, nullable: false })
  title: string;

  @Column({ length: 300, nullable: false })
  content: string;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @BeforeInsert()
  createPost() {
    this.id = uuid();
  }
}
