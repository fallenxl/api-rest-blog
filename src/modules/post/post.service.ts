import { HttpException, Injectable, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create_post.dto';
import { Post } from './post.entity';
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  getAllPosts() {
    return this.postRepository.find();
  }

  getPostById(id: string) {
    return this.postRepository.findOne({ where: { id } });
  }

  createPost(post: CreatePostDto, @Request() req) {
    const newPost = this.postRepository.create({
      ...post,
      userId: req.user.id,
    });

    try {
      return this.postRepository.save(newPost);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async updatePost(id: string, post: CreatePostDto, @Request() req) {
    const postToUpdate = await this.postRepository.findOne({
      where: { id },
    });

    if (!postToUpdate) {
      throw new HttpException('Post not found', 404);
    }

    if (postToUpdate.userId !== req.user.id) {
      throw new HttpException(' You are not allowed to edit this post', 403);
    }

    try {
      await this.postRepository.update({ id }, post);

      return this.postRepository.findOne({ where: { id } });
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async deletePost(id: string, @Request() req) {
    const postToDelete = await this.postRepository.findOne({
      where: { id },
    });

    if (!postToDelete) {
      throw new HttpException('Post not found', 404);
    }

    if (postToDelete.userId !== req.user.id) {
      throw new HttpException(' You are not allowed to delete this post', 403);
    }

    await this.postRepository.delete({ id });

    return { deleted: true };
  }
}
