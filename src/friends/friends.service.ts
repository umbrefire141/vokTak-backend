import { PrismaService } from '@/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService) {}

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

  async getFriend(current_uuid: string, user_uuid: string) {
    const friend = await this.prisma.friend.findFirst({
      where: { userOf_uuid: current_uuid, user_uuid },
    });

    if (!friend) return {};

    return friend;
  }

  async addFriend(current_uuid: string, user_uuid: string) {
    const currentUser = await this.prisma.user.findFirst({
      where: { uuid: current_uuid },
    });

    if (currentUser.uuid === user_uuid)
      throw new BadRequestException(
        "You can't add yourself in list of friends",
      );

    await this.prisma.friend.create({
      data: { userOf_uuid: current_uuid, user_uuid },
    });
    return 'The user was added to your list of friends';
  }

  async confirmFriend(id: number) {
    await this.prisma.friend.update({
      where: { id },
      data: { confirmed: true },
    });
    return 'The friend was confirmed';
  }

  async cancelFriend(id: number) {
    await this.prisma.friend.delete({
      where: { id },
    });
    return 'The friend was canceled';
  }

  async removeFriend(id: number) {
    await this.prisma.friend.delete({ where: { id } });

    return 'User was removed from the list of friends';
  }
}
