import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from 'src/shared/Guards/auth.guard';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { InjectUserInterceptor } from 'src/shared/interceptors/InjectUser.interceptor';
import { ChatSchemaApi } from './chat.schema';
import { ChatService } from './chat.service';
import { ChatDto } from './dtos/chat.dto';
import { InputChatDto } from './dtos/input-chat.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOkResponse({
    description: 'Chats was gotten',
    isArray: true,
    schema: {
      example: [ChatSchemaApi],
    },
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseInterceptors(InjectUserInterceptor)
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get()
  async getAll(@CurrentUser('uuid') user_uuid: string) {
    const chats = await this.chatService.getAll(user_uuid);

    return plainToInstance(ChatDto, chats);
  }

  @ApiOkResponse({
    description: 'Chat was gotten',
    schema: {
      example: ChatSchemaApi,
    },
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const chat = await this.chatService.getOne(id);

    return plainToInstance(ChatDto, chat);
  }

  @ApiCreatedResponse({
    description: 'The chat was created',
    schema: {
      example: ChatSchemaApi,
    },
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseInterceptors(InjectUserInterceptor)
  @UseGuards(AuthGuard)
  @Post()
  create(@CurrentUser('uuid') user_uuid: string, @Body() dto: InputChatDto) {
    return this.chatService.create(user_uuid, dto);
  }

  @ApiResponse({
    status: 204,
    description: 'The chat was deleted',
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @Delete('id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.delete(id);
  }
}
