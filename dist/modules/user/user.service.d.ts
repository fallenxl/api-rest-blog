import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    createUser(newUser: CreateUserDto): Promise<User>;
    getUserById(id: string): Promise<{
        id: string;
        username: string;
        email: string;
        avatar: string;
    }>;
}
