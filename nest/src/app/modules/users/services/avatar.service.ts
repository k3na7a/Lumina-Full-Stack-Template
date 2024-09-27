import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { link, PathLike, unlink } from 'fs';
import { AvatarEntity } from 'src/library/entities/user/avatar.entity';
import { STORAGE } from 'src/library/enums/files.enum';
import { Repository } from 'typeorm';

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(AvatarEntity)
    private repository: Repository<AvatarEntity>,
  ) {}

  private unlinkFile(existingPath: PathLike): void {
    unlink(existingPath, (err: Error | null) => {
      if (err) console.log(err.message);
    });
  }

  private linkFile(existingPath: PathLike, newPath: PathLike): void {
    link(existingPath, newPath, (err: Error | null) => {
      if (err) throw new InternalServerErrorException(err.message);
      this.unlinkFile(existingPath);
    });
  }

  public async create(file: Express.Multer.File): Promise<AvatarEntity> {
    const { filename } = file;
    const avatar = this.repository.create({ filename });

    const existingPath = `./upload/${filename}`;
    const newPath = `./public/${STORAGE.AVATARS}/${filename}`;

    this.linkFile(existingPath, newPath);

    return this.repository.save(avatar);
  }

  public async findOneById(id: string): Promise<AvatarEntity> {
    const avatar = await this.repository.findOne({ where: { id } });
    if (!avatar) throw new NotFoundException();

    return avatar;
  }

  public async update(
    id: string,
    file: Express.Multer.File,
  ): Promise<AvatarEntity> {
    const avatar = await this.findOneById(id);
    const { filename } = file;

    const existingPath = `./upload/${filename}`;

    const newPath = `./public/${STORAGE.AVATARS}/${filename}`;
    const prevPath = `./public/${STORAGE.AVATARS}/${avatar.filename}`;

    this.linkFile(existingPath, newPath);
    this.unlinkFile(prevPath);

    return this.repository.save({ ...avatar, filename });
  }

  public async remove(id: string): Promise<AvatarEntity> {
    const avatar = await this.findOneById(id);

    const path = `./public/${STORAGE.AVATARS}/${avatar.filename}`;
    this.unlinkFile(path);

    return this.repository.remove(avatar);
  }
}
