import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CredentialsDto } from './dto/credentials.dto';
import { AuthGuard } from './guard/auth.guard';
import { isEmail } from '../../utils/utils';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() credentials: CredentialsDto) {
    if (!credentials.email || !credentials.password)
      throw new HttpException('Invalid credentials', 401);
    return this.authService.login(credentials);
  }

  @Post('register')
  register(@Body() user: CreateUserDto) {
    if (!user.email || !user.password || !user.username)
      throw new HttpException('Invalid credentials', 401);

    if (!isEmail(user.email)) throw new HttpException('Invalid email', 400);

    if (user.password.length < 8)
      throw new HttpException(
        'Password must be at least 8 characters long',
        400,
      );
    return this.authService.register(user);
  }

  @ApiBearerAuth()
  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Request() request) {
    const { id } = request.user;
    return this.authService.getProfile(id);
  }
}
