import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.schema';
import { CreatePostDto } from './dtos/createPost.dto';
import { User } from '../users/user.schema';
import { MESSAGES } from 'utils/constants';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createPost({ userId, ...createPostDto }: CreatePostDto) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    const newPost = new this.postModel({ ...createPostDto, user: userId });
    const savedPost = await newPost.save();
    await findUser.updateOne({
      $push: {
        posts: savedPost._id,
      },
    });
    return savedPost;
  }

  findPostById() {}
}
