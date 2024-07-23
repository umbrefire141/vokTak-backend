import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { AuthGuard } from '../shared/Guards/auth.guard';
import { UserDto } from '../users/dto/user.dto';
import { userSchemaApi } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import { AuthDto, LoginDto } from './auth.dto';
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

  @ApiCreatedResponse({
    description: 'User was signed up',
    schema: {
      example: userSchemaApi,
    },
  })
  @ApiBadRequestResponse({ description: 'User already exists' })
  @HttpCode(201)
  @Post('sign-up')
  async registration(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.usersService.create(dto);
    const sid = await this.authService.registration(user.uuid);

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

  @ApiOkResponse({
    description: 'User was signed in',
    schema: {
      example: userSchemaApi,
    },
  })
  @ApiNotFoundResponse({ description: "User isn't found" })
  @ApiUnauthorizedResponse({ description: 'Wrong password' })
  @HttpCode(200)
  @Post('sign-in')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.usersService.getUserByEmail(dto.email);

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

  @ApiOkResponse({ description: 'User was logout' })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get('logout')
  async logout(
    @Cookies() sid: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const session = await this.authService.logout(sid);
    res.cookie('sid', null, { path: '/api/', maxAge: -1 });
    return session;
  }

  @ApiOkResponse({
    description: 'Get your user',
    schema: {
      example: userSchemaApi,
    },
  })
  @ApiUnauthorizedResponse({ description: "User isn't authorized" })
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get('me')
  async getMe(@Cookies() sid: string) {
    const { user } = await this.authService.getMe(sid);
    return plainToInstance(UserDto, user);
  }
}
