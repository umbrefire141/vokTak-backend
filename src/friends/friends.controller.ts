import { CurrentUser } from '@/shared/decorators/user.decorator';
import { AuthGuard } from '@/shared/Guards/auth.guard';
import { InjectUserInterceptor } from '@/shared/interceptors/InjectUser.interceptor';
import { FriendDto } from '@/users/dto/user.dto';
import { userSchemaApi } from '@/users/user.schema';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { FriendsService } from './friends.service';

@ApiTags('friends')
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  // Get

  @ApiOkResponse({
    description: 'Friend of list was gotten',
    schema: {
      example: userSchemaApi,
    },
  })
  @ApiNotFoundResponse({ description: "User wasn't found" })
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UseInterceptors(InjectUserInterceptor)
  @Get('/get-friends')
  async getFriendsList(@CurrentUser('uuid') uuid: string) {
    const friends = await this.friendsService.getListFriends(uuid);

    return plainToInstance(FriendDto, friends);
  }

  @ApiOkResponse({
    description: 'Friend of list was gotten',
    schema: {
      example: userSchemaApi,
    },
  })
  @ApiNotFoundResponse({ description: "User wasn't found" })
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UseInterceptors(InjectUserInterceptor)
  @Get('/get-friendInfo/:uuid')
  async getFriend(
    @CurrentUser('uuid') uuid: string,
    @Param('uuid') user_uuid: string,
  ) {
    const friends = await this.friendsService.getFriend(uuid, user_uuid);

    return plainToInstance(FriendDto, friends);
  }

  // Patch

  @ApiOkResponse({
    description: 'Confirm',
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
  @Patch('confirm-friend/:id')
  async confirmFriend(@Param('id') id: number) {
    return this.friendsService.confirmFriend(id);
  }

  @ApiOkResponse({
    description: 'Cancel',
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
  @Patch('cancel-friend/:id')
  async cancelFriend(@Param('id') id: number) {
    console.log(id);

    return this.friendsService.cancelFriend(id);
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
    return this.friendsService.addFriend(uuid, user_uuid);
  }

  @ApiOkResponse({
    description: 'Friend was removed from the list of friends',
    schema: {
      example: userSchemaApi,
    },
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          example: 'any friend_id',
        },
      },
    },
  })
  @UseGuards(AuthGuard)
  @Delete('remove-friend/:id')
  async removeFriendFromListFriends(@Param('id') id: number) {
    return this.friendsService.removeFriend(id);
  }
}
