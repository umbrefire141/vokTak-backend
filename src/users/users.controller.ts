import { Cookies } from '@/auth/cookie.decorator';
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
  Res,
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
import { Response } from 'express';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { AuthGuard } from 'src/shared/Guards/auth.guard';
import { InjectUserInterceptor } from 'src/shared/interceptors/InjectUser.interceptor';
import { UploadFileInterceptor } from 'src/shared/interceptors/upload-file.interceptor';
import {
  ChangeLanuageDto,
  ChangePasswordUserDto,
  UpdateUserDto,
} from './dto/input-user.dto';
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

  // Get methods

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
  @Get('one/:uuid')
  async getUser(@Param('uuid') uuid: string) {
    const user = await this.usersService.getUser(uuid);
    this.cacheService.set(`user/${user.uuid}`, user);
    return plainToInstance(UserDto, user);
  }

  // Put methods

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
  @Put('')
  async updateUser(
    @CurrentUser('uuid') uuid: string,
    @Body() dto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(uuid, dto);

    this.cacheService.del('users');
    this.cacheService.del(`user/${uuid}`);

    return plainToInstance(UserDto, user);
  }

  // Patch methods

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
  @Patch('user-info')
  async updateUserInfo(
    @CurrentUser('uuid') uuid: string,
    @Body() dto: UserInfoDto,
  ) {
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
  @Patch('change-password')
  async changePassword(
    @CurrentUser('uuid') uuid: string,
    @Body() dto: ChangePasswordUserDto,
  ) {
    const user = await this.usersService.changePassword(uuid, dto);

    this.cacheService.del('users');
    this.cacheService.del(`user/${uuid}`);

    return plainToInstance(UserDto, user);
  }

  @ApiOkResponse({
    description: 'Language of user was changed',
    schema: {
      example: userSchemaApi,
    },
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @UseInterceptors(InjectUserInterceptor)
  @HttpCode(200)
  @Patch('change-language')
  async changeLanguage(
    @CurrentUser('uuid') uuid: string,
    @Body() dto: ChangeLanuageDto,
  ) {
    const user = await this.usersService.changeLanguage(uuid, dto);

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

  // Delete methods

  @ApiResponse({
    status: 204,
    description: 'user was deleted',
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseInterceptors(InjectUserInterceptor)
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete()
  async delete(
    @CurrentUser('uuid') uuid: string,
    @Cookies() sid: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie('sid', null, { path: '/api/', maxAge: -1 });
    await this.usersService.delete(uuid, sid);
    this.cacheService.del('users');
    this.cacheService.del(`user/${uuid}`);

    return 'Account was deleted';
  }
}
