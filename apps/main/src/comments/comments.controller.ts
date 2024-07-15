import { CurrentUser } from '@app/common/shared/decorators/user.decorator';
import { InjectUserInterceptor } from '@app/common/shared/interceptors/InjectUser.interceptor';
import { AuthGuard } from '@app/shared/Guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
import { InputCommentDto } from './comment.dto';
import { commentSchemaApi } from './comment.schema';
import { CommentsService } from './comments.service';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiCreatedResponse({
    description: 'Comment was added',
    schema: { example: commentSchemaApi },
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @UseInterceptors(InjectUserInterceptor)
  @Post()
  create(@CurrentUser('uuid') user_uuid: string, @Body() dto: InputCommentDto) {
    return this.commentsService.create(user_uuid, dto);
  }

  @ApiOkResponse({
    description: 'Comment was updated',
    schema: { example: commentSchemaApi },
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, dto: InputCommentDto) {
    return this.commentsService.update(id, dto);
  }

  @ApiResponse({
    status: 204,
    description: 'Comment was deleted',
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.delete(id);
  }
}
