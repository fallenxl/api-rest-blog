import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../user.service';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { v4 as uuid } from 'uuid';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create a user', async () => {
    const user: CreateUserDto = {
      username: 'test',
      email: 'test@test.com',
      password: 'password',
    };

    userRepository.create = jest.fn().mockReturnValue({
      id: uuid(),
      ...user,
    });

    userRepository.save = jest.fn().mockReturnValue({
      id: uuid(),
      ...user,
    });

    userRepository.findOne = jest.fn().mockReturnValue(null);

    const newUser = await service.createUser(user);
    expect(newUser).toBeDefined();
  });

  it('should not create a user if email already exists', async () => {
    const user: CreateUserDto = {
      username: 'test',
      email: 'test@test.com',
      password: 'password',
    };

    userRepository.findOne = jest.fn().mockReturnValue({
      id: uuid(),
      ...user,
    });

    await expect(service.createUser(user)).rejects.toThrow(
      'Email already exists',
    );
  });

  it('should not create a user if username already exists', async () => {
    const user: CreateUserDto = {
      username: 'test',
      email: 'testxd@test.com',
      password: 'password',
    };

    service.getUserbyEmail = jest.fn().mockReturnValue(null);
    service.getUserByUsername = jest.fn().mockReturnValue(user);
    await expect(service.createUser(user)).rejects.toThrow(
      'Username already exists',
    );
  });

  it('should get a user by id', async () => {
    const user = {
      id: uuid(),
      username: 'test',
      email: 'test@test.com',
      password: 'password',
    };

    service.getUserById = jest.fn().mockReturnValue(user);
    const result = await service.getUserById(user.id);
    expect(result).toBe(user);
  });

  it('should get a user by email', async () => {
    const user = {
      id: uuid(),
      username: 'test',
      email: 'test@test.com',
      password: 'password',
    };

    service.getUserbyEmail = jest.fn().mockReturnValue(user);
    const result = await service.getUserbyEmail(user.email);

    expect(result).toBe(user);
  });
});
