import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { Repository } from 'typeorm';
import { UserService } from '../../user/user.service';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import * as bcrypt from 'bcrypt';

describe('AuthController', () => {
  let controller: AuthController;
  let jwtService: JwtService;
  // let authService: AuthService;
  let userService: UserService;

  let mockUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        JwtService,
        AuthService,
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jwtService = module.get<JwtService>(JwtService);
    // authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);

    mockUser = {
      id: 1,
      username: 'test',
      email: 'test@test.com',
      password: bcrypt.hashSync('password', 10),
    };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Login', () => {
    it('Should login', async () => {
      const credentials = {
        email: 'test@test.com',
        password: 'password',
      };

      const token = await jwtService.signAsync(
        { id: mockUser.id },
        {
          secret: 'secret',
        },
      );

      userService.getUserbyEmail = jest.fn().mockResolvedValue(mockUser);

      const result = await controller.login(credentials);

      expect(result).toEqual({ access_token: token });
    });

    it('Should throw an error if user does not exist', async () => {
      const credentials = {
        email: 'test@test2.com',
        password: 'password',
      };

      userService.getUserbyEmail = jest.fn().mockResolvedValue(null);

      await expect(controller.login(credentials)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('Should throw an error if password is incorrect', async () => {
      const credentials = {
        email: 'test@test.com',
        password: 'password2',
      };

      userService.getUserbyEmail = jest.fn().mockResolvedValue(mockUser);
      bcrypt.compareSync = jest.fn().mockReturnValue(false);

      await expect(controller.login(credentials)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
});
