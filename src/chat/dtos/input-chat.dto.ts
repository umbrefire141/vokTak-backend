import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { ChatDto } from './chat.dto';

export class InputChatDto extends PickType(ChatDto, ['name']) {
  @ApiProperty()
  @IsArray()
  receiver_uuids: string[];

  @ApiProperty()
  @IsString()
  message: string;
}
