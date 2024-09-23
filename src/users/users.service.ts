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
      this.prisma.user.findFirst({});
      return await this.prisma.user.findFirstOrThrow({
        where: { uuid },
        select: userSelectedData,
      });
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

    const verifiedPassword = await compare(currentUser.password, dto.password);

    if (verifiedPassword) throw new UnauthorizedException('Wrong password');

    return await this.prisma.user.update({
      where: { uuid },
      data: { password: dto.newPassword },
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

    await this.prisma.friend.create({ data: { user_uuid } });
    return 'The user was added to your list of friends';
  }

  async delete(uuid: string) {
    return await this.prisma.user.delete({ where: { uuid } });
  }
}
