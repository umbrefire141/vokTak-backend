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
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { AuthGuard } from 'src/shared/Guards/auth.guard';
import { InjectUserInterceptor } from 'src/shared/interceptors/InjectUser.interceptor';
import { UploadFileInterceptor } from 'src/shared/interceptors/upload-file.interceptor';
import { ChangePasswordUserDto, UpdateUserDto } from './dto/input-user.dto';
import { UserInfoDto } from './dto/user-info.dto';
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
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @UseInterceptors(InjectUserInterceptor)
  @HttpCode(200)
  @Get()
  async getAll(@CurrentUser('uuid') uuid: string) {
    const users = await this.usersService.getAllUsers(uuid);
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

  @ApiOkResponse({
    description: 'Info of user was updated',
    schema: {
      example: userSchemaApi,
    },
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @UseInterceptors(InjectUserInterceptor)
  @HttpCode(200)
  @Patch('user-info/:uuid')
  async updateUserInfo(@Param('uuid') uuid: string, @Body() dto: UserInfoDto) {
    const user = await this.usersService.updateInfo(uuid, dto);

    this.cacheService.del('users');
    this.cacheService.del(`user/${uuid}`);

    return plainToInstance(UserDto, user);
  }

  @ApiOkResponse({
    description: 'Password of user was changed',
    schema: {
      example: userSchemaApi,
    },
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @UseInterceptors(InjectUserInterceptor)
  @HttpCode(200)
  @Patch('change-password/:uuid')
  async changePassword(
    @Param('uuid') uuid: string,
    @Body() dto: ChangePasswordUserDto,
  ) {
    const user = await this.usersService.changePassword(uuid, dto);

    this.cacheService.del('users');
    this.cacheService.del(`user/${uuid}`);

    return plainToInstance(UserDto, user);
  }

  @ApiOkResponse({
    description: 'Avatar was updated',
    schema: {
      example: userSchemaApi,
    },
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
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
  ) {
    const user = await this.usersService.updateAvatar(uuid, img);

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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user_uuid: {
          type: 'string',
          example: 'any user_uuid',
        },
      },
    },
  })
  @UseGuards(AuthGuard)
  @UseInterceptors(InjectUserInterceptor)
  @Patch('add-friend')
  async addFriend(
    @CurrentUser('uuid') uuid: string,
    @Body() { user_uuid }: { user_uuid: string },
  ) {
    return this.usersService.addFriend(uuid, user_uuid);
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
}
