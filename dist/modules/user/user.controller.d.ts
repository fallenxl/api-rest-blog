import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    createUser(user: CreateUserDto): Promise<import("./user.entity").User>;
}
