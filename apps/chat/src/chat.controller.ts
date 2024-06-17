import { AuthGuard } from '@app/common/shared/Guards/auth.guard';
import { CurrentUser } from '@app/common/shared/decorators/user.decorator';
import { InjectUserInterceptor } from '@app/common/shared/interceptors/InjectUser.interceptor';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dtos/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseInterceptors(InjectUserInterceptor)
  @UseGuards(AuthGuard)
  @Get()
  getAll(@CurrentUser('uuid') user_uuid: string) {
    return this.chatService.getAll(user_uuid);
  }

  @UseGuards(AuthGuard)
  @Get('id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.getOne(id);
  }

  @UseInterceptors(InjectUserInterceptor)
  @UseGuards(AuthGuard)
  @Post()
  create(@CurrentUser('uuid') user_uuid: string, @Body() chatDto: ChatDto) {
    return this.chatService.create(user_uuid, chatDto);
  }

  @UseGuards(AuthGuard)
  @Delete('id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.delete(id);
  }
}
