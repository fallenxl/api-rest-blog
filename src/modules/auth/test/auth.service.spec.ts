import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CredentialsDto } from '../dto/credentials.dto';
describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let mockUser;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);

    mockUser = {
      id: '1',
      email: 'test@test.com',
      username: 'test',
      password: bcrypt.hashSync('password', 10),
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Login', () => {
    it('Should login', async () => {
      userService.getUserbyEmail = jest.fn().mockResolvedValue(mockUser);

      const credentials: CredentialsDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const result = await service.login(credentials);
      expect(result).toHaveProperty('access_token');
    });

    it('Should throw an error if user does not exist', async () => {
      userService.getUserbyEmail = jest.fn().mockResolvedValue(null);

      const credentials: CredentialsDto = {
        email: 'test@test.com',
        password: 'password',
      };

      await expect(service.login(credentials)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('Should throw an error if password is invalid', async () => {
      userService.getUserbyEmail = jest.fn().mockResolvedValue(mockUser);

      const credentials: CredentialsDto = {
        email: 'test@test.com',
        password: 'wrongpassword',
      };

      await expect(service.login(credentials)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('Should return a token', async () => {
      userService.getUserbyEmail = jest.fn().mockResolvedValue(mockUser);
      const credentials: CredentialsDto = {
        email: 'test@test.com',
        password: 'password',
      };

      const token = await jwtService.signAsync({ id: mockUser.id }, {
        secret: 'secret',
      });
      const result = await service.login(credentials);
   
      expect(result).toHaveProperty('access_token', token);

    });

  });
});
