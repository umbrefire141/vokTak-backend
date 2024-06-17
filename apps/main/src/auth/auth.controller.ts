import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { AuthGuard } from '../../../../libs/common/src/shared/Guards/auth.guard';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Cookies } from './cookie.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  @Post('register')
  async register(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.usersService.create(dto);
    const sid = await this.authService.register(user.uuid);

    res.cookie('sid', sid, {
      path: '/api/',
      signed: true,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1e3,
      secure: true,
      domain: this.config.get('DOMAIN'),
    });
    return plainToInstance(UserDto, user);
  }

  @Post('login')
  async login(
    @Body() dto: Pick<AuthDto, 'name' | 'password'>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.usersService.getUserByName(dto.name);

    const sid = await this.authService.login(
      user.uuid,
      user.password,
      dto.password,
    );
    res.cookie('sid', sid, {
      path: '/api/',
      signed: true,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1e3,
      secure: true,
      domain: this.config.get('DOMAIN'),
    });
    return plainToInstance(UserDto, user);
  }

  @Get('logout')
  @UseGuards(AuthGuard)
  async logout(
    @Cookies() sid: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const session = await this.authService.logout(sid);
    res.cookie('sid', null, { path: '/api/', maxAge: -1 });
    return session;
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Cookies() sid: string) {
    const { user } = await this.authService.getMe(sid);
    return plainToInstance(UserDto, user);
  }
}
