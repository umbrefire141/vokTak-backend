import { UserDto } from '@/users/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { MessageDto } from './message.dto';

export class ChatDto {
  @Expose()
  id: number;

  @Expose()
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @Expose()
  @ApiProperty()
  @Type(() => MessageDto)
  messages: MessageDto[];

  @Expose()
  @ApiProperty()
  @Type(() => UserDto)
  users: UserDto[];
}
