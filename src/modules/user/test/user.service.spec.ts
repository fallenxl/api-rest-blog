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
});
