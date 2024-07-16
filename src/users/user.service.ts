import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserSettings } from 'src/users/userSettings.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserSettings.name)
    private userSettingsModel: Model<UserSettings>,
  ) {}

  async createUser({ settings, ...createUserDto }: CreateUserDto) {
    if (settings) {
      const savedNewSettings = await new this.userSettingsModel(settings).save();
      const newUser = new this.userModel({
        ...createUserDto,
        settings: savedNewSettings._id,
      });
      return newUser.save();
    }
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async getsUsers(page: number, limit: number) {
    const users = await this.userModel.find().limit(limit).skip((page-1) * limit).populate(['settings', 'posts']).exec() 
    const itemCount =  users.length
    const total = await this.userModel.countDocuments()
    const data = {
      users,
      itemCount,
      total
    }
    return data
  }

  getUserById(id: string) {
    return this.userModel.findById(id).populate(['settings', 'posts']);
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
