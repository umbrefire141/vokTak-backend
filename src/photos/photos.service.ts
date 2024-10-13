import { PrismaService } from '@/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { InputPhotoDto } from './dto/input-photo.dto';

@Injectable()
export class PhotosService {
  constructor(private readonly prisma: PrismaService) {}

  async getPhotos() {
    return await this.prisma.photo.findMany();
  }

  async getPhoto(id: number) {
    const photo = await this.prisma.photo.findFirst({ where: { id } });

    if (!photo) throw new NotFoundException("Photo wasn't found");

    return photo;
  }

  async addPhoto(dto: InputPhotoDto, user_uuid: string) {
    const addedPhoto = await this.prisma.photo.create({
      data: { ...dto, user_uuid },
    });

    return addedPhoto;
  }

  async deletePhoto(id: number) {
    const photo = await this.prisma.photo.findFirst({ where: { id } });

    await unlink(photo.image);

    return await this.prisma.photo.delete({ where: { id } });
  }

  async hidePhoto(id: number) {
    const photo = await this.getPhoto(id);

    await this.prisma.photo.update({
      where: { id: photo.id },
      data: { hidden: true },
    });

    return 'Photo was hidden';
  }

  async unhidePhoto(id: number) {
    const photo = await this.getPhoto(id);

    await this.prisma.photo.update({
      where: { id: photo.id },
      data: { hidden: false },
    });

    return 'Photo was unhidden';
  }
}
