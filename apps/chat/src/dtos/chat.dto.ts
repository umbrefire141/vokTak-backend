import { IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  receiver_uuid: string;
}
