import { PrismaService } from '@/prisma.service';
import { userSelectedData } from '@/shared/selectedData/user';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import {
  ChangeLanuageDto,
  ChangePasswordUserDto,
  InputUserDto,
  UpdateUserDto,
} from './dto/input-user.dto';
import { UserInfoDto } from './dto/user-info.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(uuid: string) {
    return await this.prisma.user.findMany({
      where: {
        NOT: {
          uuid,
        },
      },
      select: userSelectedData,
    });
  }

  async getUser(uuid: string) {
    try {
      const user = await this.prisma.user.findFirstOrThrow({
        where: { uuid },
        select: {
          ...userSelectedData,
          friends: {
            where: { confirmed: true },
            include: {
              user: { include: { avatar: true } },
              userOf: { include: { avatar: true } },
            },
          },
          friendsOf: {
            where: { confirmed: true },
            include: {
              user: { include: { avatar: true } },
              userOf: { include: { avatar: true } },
            },
          },
        },
      });

      return { ...user, friends: [...user.friends, ...user.friendsOf] };
    } catch (error) {
      throw new NotFoundException("User isn't found");
    }
  }

  async getUserByEmail(email: string) {
    try {
      return await this.prisma.user.findFirstOrThrow({
        where: { email },
        include: { avatar: true },
      });
    } catch (error) {
      throw new NotFoundException("User isn't found");
    }
  }

  async getListFriends(uuid: string) {
    const { friends, friendsOf } = await this.prisma.user.findFirst({
      where: { uuid },
      include: {
        friends: {
          where: { OR: [{ user_uuid: uuid }, { userOf_uuid: uuid }] },
          include: {
            user: { include: { avatar: true } },
            userOf: { include: { avatar: true } },
          },
        },
        friendsOf: {
          where: { OR: [{ user_uuid: uuid }, { userOf_uuid: uuid }] },
          include: {
            user: { include: { avatar: true } },
            userOf: { include: { avatar: true } },
          },
        },
      },
    });

    return [...friends, ...friendsOf].filter(
      (friend) => friend.confirmed === true || friend.user_uuid === uuid,
    );
  }

  async create(dto: InputUserDto) {
    const existedUser = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (existedUser) throw new BadRequestException('User already exists');

    const salt = await genSalt(8);
    const hashedPassword = await hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        nickname: dto.nickname,
        firstname: dto.firstname,
        lastname: dto.lastname,
        password: hashedPassword,
        role_id: 1,
      },
      select: userSelectedData,
    });

    return user;
  }

  async update(uuid: string, dto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { uuid },
      data: { ...dto },
      select: userSelectedData,
    });
  }

  async updateInfo(uuid: string, dto: Omit<UserInfoDto, 'id'>) {
    const currentUser = await this.prisma.user.findFirst({
      where: { uuid },
      include: {
        user_info: true,
      },
    });

    if (!currentUser.user_info) {
      await this.prisma.user_Info.create({ data: { user_uuid: uuid, ...dto } });
      return currentUser;
    }

    await this.prisma.user_Info.update({
      where: { user_uuid: uuid },
      data: { ...dto },
    });
    return currentUser;
  }

  async changePassword(uuid: string, dto: ChangePasswordUserDto) {
    const currentUser = await this.prisma.user.findFirst({ where: { uuid } });

    const verifiedPassword = await compare(
      currentUser.password,
      dto.oldPassword,
    );

    if (!verifiedPassword) throw new UnauthorizedException('Wrong password');

    return await this.prisma.user.update({
      where: { uuid },
      data: { password: dto.newPassword },
    });
  }

  async changeLanguage(uuid: string, dto: ChangeLanuageDto) {
    return await this.prisma.user.update({
      where: { uuid },
      data: { language: dto.language },
    });
  }

  async updateAvatar(uuid: string, avatar: Express.Multer.File) {
    const path = avatar.path.replace(/\\/g, '/');

    return await this.prisma.user.update({
      where: { uuid },
      data: {
        avatar: {
          create: { photo: { create: { name: avatar.filename, image: path } } },
        },
      },
    });
  }

  async addFriend(uuid: string, user_uuid: string) {
    const currentUser = await this.prisma.user.findFirst({
      where: { uuid },
    });

    if (currentUser.uuid === user_uuid)
      throw new BadRequestException(
        "You can't add yourself in list of friends",
      );

    await this.prisma.friend.create({ data: { userOf_uuid: uuid, user_uuid } });
    return 'The user was added to your list of friends';
  }

  async confirmFriend(id: number) {
    await this.prisma.friend.update({
      where: { id },
      data: { confirmed: true },
    });
    return 'The friend was confirmed';
  }

  async delete(uuid: string, sid: string) {
    await this.prisma.session.delete({ where: { sid } });
    return await this.prisma.user.delete({ where: { uuid } });
  }
}
