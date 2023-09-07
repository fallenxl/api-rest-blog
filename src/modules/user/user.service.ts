import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  createUser(newUser: CreateUserDto) {
    const user = this.userRepository.create(newUser);
    return this.userRepository.save(user);
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    const data = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    };
    return data;
  }
}
