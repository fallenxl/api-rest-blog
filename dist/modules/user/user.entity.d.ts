import { Post } from '../post/post.entity';
export declare class User {
    id: string;
    username: string;
    email: string;
    password: string;
    avatar: string;
    createdAt: Date;
    createUser(): void;
    emailAndUsernameToLowerCase(): void;
    posts: Post[];
}
