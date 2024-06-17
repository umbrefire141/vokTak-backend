import {
  Pagination,
  PaginationParams,
} from '@app/common/shared/decorators/pagination.decorator';
import { CurrentUser } from '@app/common/shared/decorators/user.decorator';
import { InjectUserInterceptor } from '@app/common/shared/interceptors/InjectUser.interceptor';
import { UploadFileInterceptor } from '@app/common/shared/interceptors/upload-file.interceptor';
import { AuthGuard } from '@app/shared/Guards/auth.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import { PostPaginationDto } from './dto/post-pagination.dto';
import { InputPostDto, PostDto } from './dto/post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  @Get()
  async getAll(@PaginationParams() pagination: Pagination) {
    const { posts, page, size, total } =
      await this.postsService.getAll(pagination);

    this.cacheService.set('posts', posts);

    return plainToInstance(PostPaginationDto, { page, size, total, posts });
  }

  @Get(':uuid')
  async getOne(@Param('uuid') uuid: string) {
    const post = await this.postsService.getOne(uuid);

    this.cacheService.set(`post/${uuid}`, post);

    return plainToInstance(PostDto, post);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(InjectUserInterceptor)
  async create(
    @CurrentUser('uuid') user_uuid: string,
    @Body() dto: InputPostDto,
  ) {
    const post = await this.postsService.create(user_uuid, dto);

    return plainToInstance(PostDto, post);
  }

  @Put(':uuid')
  @UseGuards(AuthGuard)
  @UseInterceptors(InjectUserInterceptor)
  async update(
    @CurrentUser('uuid') user_uuid: string,
    @Param('uuid') post_uuid: string,
    @Body() dto: InputPostDto,
  ) {
    const post = await this.postsService.update(user_uuid, post_uuid, dto);

    this.cacheService.del('posts');
    this.cacheService.del(`post/${post_uuid}`);

    return plainToInstance(PostDto, post);
  }

  @Delete(':uuid')
  @UseGuards(AuthGuard)
  @UseInterceptors(InjectUserInterceptor)
  async delete(@Param('uuid') post_uuid: string) {
    const post = await this.postsService.delete(post_uuid);

    this.cacheService.del('posts');
    this.cacheService.del(`post/${post_uuid}`);

    return plainToInstance(PostDto, post);
  }

  @Patch('update-avatar/:uuid')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    UploadFileInterceptor('image', {
      dest: 'uploads/posts/images/[YYYY]/[MM]',
    }),
    InjectUserInterceptor,
  )
  async updateAvatar(
    @Param('uuid') uuid: string,
    @UploadedFile() img: Express.Multer.File,
  ) {
    const post = await this.postsService.updateImage(uuid, img);

    this.cacheService.del('posts');
    this.cacheService.del(`post/${uuid}`);

    return plainToInstance(PostDto, post);
  }
}
