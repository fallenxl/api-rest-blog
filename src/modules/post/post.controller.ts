import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CreatePostDto } from './dto/create_post.dto';
import { PostService } from './post.service';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  createPost(@Body() post: CreatePostDto, @Request() req) {
    if (!post.title || !post.content) {
      throw new HttpException('Missing parameters', 400);
    }

    return this.postService.createPost(post, req);
  }
}
