import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CredentialsDto } from './dto/credentials.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(credentials: CredentialsDto) {
    const user = await this.userService.getUserbyEmail(credentials.email);
    if (!user) throw new HttpException('Invalid credentials', 401);

    const isPasswordValid = bcrypt.compareSync(
      credentials.password,
      user.password,
    );

    if (!isPasswordValid) throw new HttpException('Invalid credentials', 401);

    const token = this.jwtService.sign(
      { id: user.id },
      {
        secret: 'secret',
      },
    );

    return {
      access_token: token,
    };
  }

  async register(user: CreateUserDto) {

    const newUser = await this.userService.createUser(user);
    const token = this.jwtService.sign(
      { id: newUser.id },
      {
        secret: 'secret',
      },
    );
    return {
      access_token: token,
    };
  }

  async getProfile(id: string) {
    const user = await this.userService.getUserById(id);
    if (!user) throw new HttpException('User not found', 404);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    };
  }
}
