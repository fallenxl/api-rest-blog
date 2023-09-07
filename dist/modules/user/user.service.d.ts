import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    createUser(user: CreateUserDto): Promise<User>;
    getUserById(id: string): Promise<User>;
    getUserbyEmail(email: string): Promise<User>;
    getUserByUsername(username: string): Promise<User>;
}
