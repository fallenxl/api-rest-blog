/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true, length: 20, nullable: false })
  username: string;

  @Column({ unique: true, length: 50, nullable: false })
  email: string;

  @Column()
  password: string;

  @Column({ default: null })
  avatar: string;

  @BeforeInsert()
  createUser(){
    this.id = uuid();
    this.password = bcrypt.hashSync(this.password, 10);
    this.avatar = `https://api.dicebear.com/7.x/pixel-art-neutral/svg?seed=${this.username}`
  }

  @BeforeInsert()
  emailAndUsernameToLowerCase(){
    this.email = this.email.toLowerCase();
    this.username = this.username.toLowerCase();
  }
}
