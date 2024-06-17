import { CurrentUser } from '@app/common/shared/decorators/user.decorator';
import { InjectUserInterceptor } from '@app/common/shared/interceptors/InjectUser.interceptor';
import { AuthGuard } from '@app/shared/Guards/auth.guard';
import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InputCommentDto } from './comment.dto';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(InjectUserInterceptor)
  create(@CurrentUser('uuid') user_uuid: string, dto: InputCommentDto) {
    return this.commentsService.create(user_uuid, dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(@Param('id', ParseIntPipe) id: number, dto: InputCommentDto) {
    return this.commentsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards()
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.delete(id);
  }
}
