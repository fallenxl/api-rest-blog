import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto) {
    const emailExists = await this.getUserbyEmail(user.email);
    const usernameExists = await this.getUserByUsername(user.username);

    if (emailExists) {
      throw new HttpException('Email already exists', 400);
    }

    if (usernameExists) {
      throw new HttpException('Username already exists', 400);
    }
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  getUserById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  getUserbyEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  getUserByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }
}
