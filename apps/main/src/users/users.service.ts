import { PrismaService } from '@app/common';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { InputUserDto, UpdateUserDto } from './dto/input-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return await this.prisma.user.findMany();
  }

  async getUser(uuid: string) {
    try {
      return await this.prisma.user.findFirstOrThrow({
        where: { uuid },
        select: {
          uuid: true,
          avatar: true,
          email: true,
          name: true,
          posts: true,
          createdAt: true,
          password: false,
          friends: { include: { user: true } },
        },
      });
    } catch (error) {
      throw new NotFoundException("User isn't found");
    }
  }

  async getUserByName(name: string) {
    try {
      return await this.prisma.user.findFirstOrThrow({
        where: { name },
      });
    } catch (error) {
      throw new NotFoundException("User isn't found");
    }
  }

  async create(dto: InputUserDto) {
    const existedUser = await this.prisma.user.findFirst({
      where: { name: dto.name },
    });

    if (existedUser) throw new BadRequestException('User already exists');

    const salt = await genSalt(8);
    const hashedPassword = await hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        role_id: 1,
      },
    });

    return user;
  }

  async update(uuid: string, dto: UpdateUserDto) {
    return await this.prisma.user.update({ where: { uuid }, data: { ...dto } });
  }

  async delete(uuid: string) {
    return await this.prisma.user.delete({ where: { uuid } });
  }

  async updateAvatar(uuid: string, avatar: Express.Multer.File) {
    const path = avatar.path.replace(/\\/g, '/');

    return await this.prisma.user.update({
      where: { uuid },
      data: { avatar: path },
    });
  }

  async addFriend(user_uuid: string) {
    await this.prisma.friend.create({ data: { user_uuid } });
    return 'The user was added to your list of friends';
  }
}
