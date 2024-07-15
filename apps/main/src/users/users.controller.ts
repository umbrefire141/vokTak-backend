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
  HttpCode,
  Inject,
  Param,
  Patch,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import { InputPhotoDto } from '../photos/dto/input-photo.dto';
import { UpdateUserDto } from './dto/input-user.dto';
import { UserDto } from './dto/user.dto';
import { userSchemaApi } from './user.schema';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  @ApiOkResponse({
    description: 'Users was gotten',
    isArray: true,
    schema: {
      example: [userSchemaApi],
    },
  })
  @HttpCode(200)
  @Get()
  async getAll() {
    const users = await this.usersService.getAllUsers();
    this.cacheService.set('users', users);
    return plainToInstance(UserDto, users);
  }

  @ApiOkResponse({
    description: 'user was gotten',
    schema: {
      example: userSchemaApi,
    },
  })
  @ApiNotFoundResponse({ description: "User wasn't found" })
  @HttpCode(200)
  @Get(':uuid')
  async getUser(@Param('uuid') uuid: string) {
    const user = await this.usersService.getUser(uuid);
    this.cacheService.set(`user/${user.uuid}`, user);
    return plainToInstance(UserDto, user);
  }

  @ApiOkResponse({
    description: 'user was updated',
    schema: {
      example: userSchemaApi,
    },
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @UseInterceptors(InjectUserInterceptor)
  @HttpCode(200)
  @Put(':uuid')
  async updateUser(@Param('uuid') uuid: string, dto: UpdateUserDto) {
    const user = await this.usersService.update(uuid, dto);
    this.cacheService.del('users');
    this.cacheService.del(`user/${uuid}`);

    return plainToInstance(UserDto, user);
  }

  @ApiResponse({
    status: 204,
    description: 'user was deleted',
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string) {
    await this.usersService.delete(uuid);
    this.cacheService.del('users');
    this.cacheService.del(`user/${uuid}`);

    return 'Account was deleted';
  }

  @ApiOkResponse({
    description: 'Avatar was updated',
    schema: {
      example: userSchemaApi,
    },
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @UseInterceptors(
    UploadFileInterceptor('avatar', {
      dest: 'uploads/users/avatars/[YYYY]/[MM]',
    }),
    InjectUserInterceptor,
  )
  @Patch('update-avatar')
  async updateAvatar(
    @CurrentUser('uuid') uuid: string,
    @UploadedFile() img: Express.Multer.File,
    @Body() dto: InputPhotoDto,
  ) {
    const user = await this.usersService.updateAvatar(uuid, img, dto);

    this.cacheService.del('users');
    this.cacheService.del(`user/${uuid}`);

    return plainToInstance(UserDto, user);
  }

  @ApiOkResponse({
    description: 'Friend was added',
    schema: {
      example: userSchemaApi,
    },
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @Patch('add-friend')
  async addFriend(@Body() { user_uuid }: { user_uuid: string }) {
    return this.usersService.addFriend(user_uuid);
  }
}
