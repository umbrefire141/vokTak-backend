import { IsNumber, IsString } from 'class-validator';

export class MessageDto {
  @IsNumber()
  chat_id: number;
  @IsString()
  message: string;
}
