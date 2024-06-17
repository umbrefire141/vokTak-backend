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
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './dto/input-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  @Get()
  async getAll() {
    const users = await this.usersService.getAllUsers();
    this.cacheService.set('users', users);
    return plainToInstance(UserDto, users);
  }

  @Get(':uuid')
  async getUser(@Param('uuid') uuid: string) {
    const user = await this.usersService.getUser(uuid);
    this.cacheService.set(`user/${user.uuid}`, user);
    return plainToInstance(UserDto, user);
  }

  @Put(':uuid')
  @UseGuards(AuthGuard)
  @UseInterceptors(InjectUserInterceptor)
  async updateUser(@Param('uuid') uuid: string, dto: UpdateUserDto) {
    const user = await this.usersService.update(uuid, dto);
    this.cacheService.del('users');
    this.cacheService.del(`user/${uuid}`);

    return plainToInstance(UserDto, user);
  }

  @Delete(':uuid')
  @UseGuards(AuthGuard)
  async delete(@Param('uuid') uuid: string) {
    await this.usersService.delete(uuid);
    this.cacheService.del('users');
    this.cacheService.del(`user/${uuid}`);

    return 'Account was deleted';
  }

  @Patch('update-avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    UploadFileInterceptor('avatar', {
      dest: 'uploads/users/avatars/[YYYY]/[MM]',
    }),
    InjectUserInterceptor,
  )
  async updateAvatar(
    @CurrentUser('uuid') uuid: string,
    @UploadedFile() img: Express.Multer.File,
  ) {
    const user = await this.usersService.updateAvatar(uuid, img);

    this.cacheService.del('users');
    this.cacheService.del(`user/${uuid}`);

    return plainToInstance(UserDto, user);
  }

  @Patch('add-friend')
  @UseGuards()
  async addFriend(@Body() { user_uuid }: { user_uuid: string }) {
    return this.usersService.addFriend(user_uuid);
  }
}
