import { IsOptional, IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  receiver_uuids: string[];
}
