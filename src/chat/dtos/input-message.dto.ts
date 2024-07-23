import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { MessageDto } from './message.dto';

export class InputMessageDto extends PickType(MessageDto, ['message']) {
  @ApiProperty()
  @IsNumber()
  chat_id: number;

  @ApiProperty()
  @IsString()
  user_uuid: string;
}
