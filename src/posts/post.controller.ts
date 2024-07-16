import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  InternalServerErrorException,
  UseInterceptors
} from '@nestjs/common';
import { CreatePostDto } from './dtos/createPost.dto';
import { PostService } from './post.service';
import { TransformInterceptor } from '../interceptors/transform/transform.interceptor';

@Controller('post')
@UseInterceptors(TransformInterceptor)
export class PostController {
  constructor(private postsService: PostService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createPost(@Body() createPostDto: CreatePostDto) {
    try {
      return this.postsService.createPost(createPostDto);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
