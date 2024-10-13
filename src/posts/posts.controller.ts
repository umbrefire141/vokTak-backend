import { PhotoDto } from '@/photos/dto/photo.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import {
  Pagination,
  PaginationParams,
} from 'src/shared/decorators/pagination.decorator';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { AuthGuard } from 'src/shared/Guards/auth.guard';
import { InjectUserInterceptor } from 'src/shared/interceptors/InjectUser.interceptor';
import { UploadFileInterceptor } from 'src/shared/interceptors/upload-file.interceptor';
import { PostPaginationDto } from './dto/post-pagination.dto';
import { InputPostDto, PostDto } from './dto/post.dto';
import { postSchemaApi } from './post.schema';
import { PostsService } from './posts.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  @ApiOkResponse({
    description: 'Get all posts',
    isArray: true,
    schema: { example: [postSchemaApi] },
  })
  @ApiParam({
    name: 'pagination',
    schema: {
      example: { page: 0, limit: 50, offset: 0, size: 50 } as Pagination,
    },
  })
  @HttpCode(200)
  @Get()
  async getAll(@PaginationParams() pagination: Pagination) {
    const { posts, page, size, total } =
      await this.postsService.getAll(pagination);

    this.cacheService.set('posts', posts);

    return plainToInstance(PostPaginationDto, { page, size, total, posts });
  }

  @ApiOkResponse({
    description: 'get user',
    schema: { example: postSchemaApi },
  })
  @HttpCode(200)
  @Get(':uuid')
  async getOne(@Param('uuid') uuid: string) {
    const post = await this.postsService.getOne(uuid);

    this.cacheService.set(`post/${uuid}`, post);

    return plainToInstance(PostDto, post);
  }

  @ApiCreatedResponse({
    description: 'Post was created',
    schema: { example: postSchemaApi },
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @UseInterceptors(InjectUserInterceptor)
  @HttpCode(201)
  @Post()
  async create(
    @CurrentUser('uuid') user_uuid: string,
    @Body() dto: InputPostDto,
  ) {
    const post = await this.postsService.create(user_uuid, dto);

    return plainToInstance(PostDto, post);
  }

  @ApiOkResponse({
    description: 'Image was uploaded for post',
    schema: { example: postSchemaApi },
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @UseInterceptors(
    UploadFileInterceptor('image', {
      dest: 'uploads/posts/images/[YYYY]/[MM]',
    }),
    InjectUserInterceptor,
  )
  @HttpCode(200)
  @Post('upload-image')
  async uploadImage(
    @CurrentUser('uuid') user_uuid: string,
    @UploadedFile() img: Express.Multer.File,
  ) {
    const post = await this.postsService.uploadImage(user_uuid, img);

    return plainToInstance(PhotoDto, post);
  }

  @ApiOkResponse({
    description: 'post was updated',
    schema: { example: postSchemaApi },
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @UseInterceptors(InjectUserInterceptor)
  @HttpCode(200)
  @Put(':uuid')
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

  @ApiResponse({ status: 204, description: 'user was deleted' })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete(':uuid')
  async delete(@Param('uuid') post_uuid: string) {
    const post = await this.postsService.delete(post_uuid);

    this.cacheService.del('posts');
    this.cacheService.del(`post/${post_uuid}`);

    return plainToInstance(PostDto, post);
  }

  @ApiOkResponse({
    description: 'The post was hide',
    schema: { example: { ...postSchemaApi, hidden: true } },
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Patch('hide/:uuid')
  async hidePost(@Param('uuid') uuid: string) {
    return await this.postsService.hidePost(uuid);
  }

  @ApiOkResponse({
    description: 'The post was unhid',
    schema: { example: postSchemaApi },
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Patch('unhide/:uuid')
  async unhidePost(@Param('uuid') uuid: string) {
    return await this.postsService.unhidePost(uuid);
  }

  @ApiOkResponse({
    description: 'The post was liked',
    schema: { example: postSchemaApi },
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseInterceptors(InjectUserInterceptor)
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Patch('like/:uuid')
  async likePost(
    @Param('uuid') uuid: string,
    @CurrentUser('uuid') user_uuid: string,
  ) {
    return await this.postsService.likePost(uuid, user_uuid);
  }

  @ApiOkResponse({
    description: 'The post was unliked',
    schema: { example: postSchemaApi },
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @UseInterceptors(InjectUserInterceptor)
  @HttpCode(200)
  @Patch('unlike')
  async unlikePost(@CurrentUser('uuid') uuid: string) {
    return await this.postsService.unlikePost(uuid);
  }
}
