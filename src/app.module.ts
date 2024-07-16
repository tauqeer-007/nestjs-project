import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/user.module';
import { PostsModule } from './posts/post.module';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync(
      {
        imports : [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          uri: `${configService.get('MONGODB_CONNECTION_STRING')}/${configService.get('DATABASE_NAME')}`
        }),
        inject: [ConfigService]
      }),
    UsersModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
